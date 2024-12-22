/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'csv-parse/sync'
import { type Request, type Response } from 'express'
import isNil from 'lodash/isNil'

import { createRecords, getErrorMessage } from '../../utils'
import {
  doAdditionalChecks,
  getUnique,
  parseBodyData,
  processRelationshipFields,
  verifyHeaders,
} from './utils'

export const extractFileFromReq = (req: Request) =>
  req.files?.file && (Array.isArray(req.files.file) ? req.files.file[0] : req.files.file)

export const importData = async (req: Request, res: Response, createContext: any) => {
  try {
    const context = await createContext.withRequest(req, res)

    const { filterKeys, relationshipFields, table, requiredFields, primitiveFields } = parseBodyData(req.body)

    if (!filterKeys) return res.status(400).json({ message: 'FilterKey is not available' })

    const file = extractFileFromReq(req)?.data
    if (file) {
      const fileHeaders: string[] = parse(file, {
        skip_empty_lines: true,
        from_line: 1,
        to_line: 1,
        trim: true,
      })?.[0]

      const headerVerification = verifyHeaders({
        fileHeaders,
        allFields: [...Object.keys(primitiveFields), ...Object.keys(relationshipFields)],
        requiredFields,
      })

      if (!headerVerification.isSuccessful)
        return res.status(400).json({
          message: `required fields: ${headerVerification.missingRequiredFields.join(
            ', ',
          )} \n \n wrong fields: ${headerVerification.incorrectFields.join(', ')}`,
        })

      let records = parse(file, {
        columns: fileHeaders,
        skip_empty_lines: true,
        from_line: 2,
        trim: true,
      })

      if (records?.length) {
        records = getUnique(records, filterKeys)

        const relKeys = Object.keys(relationshipFields)
        const fieldKeys = Object.keys(primitiveFields)
        const existingRelFields = fileHeaders.filter((key) => relKeys.includes(key))
        const existingFields = fileHeaders.filter((key) => fieldKeys.includes(key))

        records = await Promise.all(
          records.map(async (record: Record<string, any>) => {
            // parse field value for boolean and number primitiveFields
            const primitiveFieldsData = existingFields.reduce(
              (updatedFields: Record<string, unknown>, field: string) => {
                return {
                  ...updatedFields,
                  [field]:
                    (!isNil(primitiveFields[field].validation?.min) ||
                      record[field] === 'true' ||
                      record[field] === 'false') &&
                    !isNil(record[field])
                      ? JSON.parse(record[field])
                      : record[field],
                }
              },
              {},
            )
            const relationFieldsData = await processRelationshipFields({
              existingRelFields,
              relationshipFields,
              record,
              context,
            })

            const rec = {
              ...primitiveFieldsData,
              ...relationFieldsData,
            }

            return rec
          }),
        )

        records = doAdditionalChecks({ records, context, table })

        const response = await createRecords(records, context, table, filterKeys[0])

        if (response.length) res.status(201).json({ message: 'Created Successfully!' })
        else res.status(200).json({ message: 'No new data created, all data exists!' })
      } else {
        res.status(400).json({ message: 'No Records Found!' })
      }
    } else {
      res.status(400).json({ message: 'File Not found!' })
    }
  } catch (err: any) {
    console.error('Error: ', err)
    res.status(500).json({ success: false, message: getErrorMessage(err) })
  }
}
