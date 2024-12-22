/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from '@json2csv/plainjs'
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { type Request, type Response } from 'express'
import { get, isEmpty, pickBy } from 'lodash'

import { TARIFF_CODE_HEADERS, TARIFF_CODE_TABLE_NAME, TariffCodeVertical } from '../../admin/constants/config'
import { pageQueryFields } from '../constants/common'
import { RelField } from '../types'
import { getErrorMessage } from '../utils'
import { getPreSignedUrl } from '../utils/s3'

export const exportData = async (req: Request, res: Response, createContext: any) => {
  try {
    const context = (await createContext.withRequest(req, res)) as KeystoneContext<BaseKeystoneTypeInfo>
    const { table } = req.body
    let { primitiveFields, filters } = req.body || {}
    const { relationshipFields } = req.body
    if (primitiveFields) primitiveFields = JSON.parse(primitiveFields)
    if (filters) filters = JSON.parse(filters)
    let parsedRelationshipFields = {} as Record<string, RelField>
    if (relationshipFields) parsedRelationshipFields = JSON.parse(relationshipFields)
    const fieldKeys: string[] = Object.keys(primitiveFields)
    const relFieldKeys: string[] = Object.keys(parsedRelationshipFields)
    if (!filters || isEmpty(filters)) {
      const query =
        fieldKeys.join(',') +
        (fieldKeys.length && relFieldKeys.length ? ',' : '') +
        relFieldKeys.map((field) => `${field}{${parsedRelationshipFields[field].refLabelField}}`).join(',')

      filters = { where: {}, query }
    }

    const data = await context.query?.[table].findMany({
      ...filters,
    })

    const filteredData = data?.map((obj: any) => ({
      ...fieldKeys?.reduce((acc: any, key: any) => (key in obj && (acc[key] = obj[key]), acc), {}),
      ...relFieldKeys?.reduce(
        (acc: any, key) => {
          if (key in obj) {
            const relationLabelField = parsedRelationshipFields[key]?.refLabelField
            if (parsedRelationshipFields[key]?.many)
              acc[key] = obj[key]?.reduce((relData: string, relItem: { [key: string]: any }, i: number) => {
                return i === 0 ? relItem?.[relationLabelField] : `${relData},${relItem?.[relationLabelField]}`
              }, '')
            else acc[key] = obj[key]?.[relationLabelField]
          }
          return acc
        },

        {},
      ),
    }))

    if (!filteredData.length) {
      res.status(400).json({ success: false, message: 'Nothing to Export!' })
      return
    }
    const parser = new Parser({})
    const csv = parser.parse(filteredData)
    res.status(200).send({ success: true, data: csv })
  } catch (err: any) {
    console.error('Error: ', err)
    res.status(500).json({ success: false, message: getErrorMessage(err) })
  }
}

export const exportPages = async (req: Request, res: Response, createContext: any) => {
  try {
    const context = (await createContext.withRequest(req, res)) as KeystoneContext<BaseKeystoneTypeInfo>
    const { table, domain, vertical } = req.body
    if (!table || !domain || !vertical) {
      res.status(400).json({ message: 'Data is missing' })
      return
    }

    const data = await context.query?.[table].findMany({
      where: {
        domain: { name: { equals: domain } },
        vertical: { name: { equals: vertical } },
      },
      query: pageQueryFields,
    })

    const filteredData = data?.map((obj) => pickBy(obj, (value) => !isEmpty(value)))
    if (!isEmpty(filteredData)) {
      const parser = new Parser({})
      const csv = parser.parse(filteredData)
      return res.status(200).send({ success: true, data: csv })
    }
    res
      .status(400)
      .json({ success: false, message: 'No data to export, Please choose other domain or vertical' })
  } catch (err) {
    console.error('Error: ', err)
    res.status(500).json({ success: false, message: 'Something Went Wrong!' })
  }
}

export const exportTariffCodes = async (
  req: Request,
  res: Response,
  createContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  try {
    const context = await createContext.withRequest(req, res)
    const { vertical } = req.body
    if (!vertical) {
      return res.status(400).json({ message: 'Must provide vertical!' })
    }
    const columnsArr = TARIFF_CODE_HEADERS[vertical as TariffCodeVertical]
    const data = await context.query?.[TARIFF_CODE_TABLE_NAME].findMany({
      where: {
        vertical: { equals: vertical },
      },
      query: columnsArr.join(', '),
    })
    const parser = new Parser({})
    const csv = parser.parse(data)
    // get the filename
    const auditLogs = await context.query?.['AuditLog'].findMany({
      where: {
        collectionName: { equals: TARIFF_CODE_TABLE_NAME },
        actionType: { equals: vertical },
      },
      query: 'id docId userId username actionType createdAt',
      orderBy: [{ createdAt: 'desc' }],
      take: 1,
    })
    return res.status(200).send({ success: true, data: csv, filename: get(auditLogs, '0.docId', '') })
  } catch (err) {
    console.error('Error: ', err)
    res.status(500).json({ success: false, message: 'Something Went Wrong!' })
  }
}

export const exportMirn = async (req: Request, res: Response) => {
  try {
    const fileName = req.body?.fileName

    if (!fileName) {
      return res.status(400).json({ message: 'File name is required to export file!' })
    }
    const presignedUrl = await getPreSignedUrl({
      bucket: process.env.S3_MIRN_BUCKET || '',
      keyName: fileName,
    })

    res.status(200).send({ success: true, url: presignedUrl })
  } catch (err) {
    console.error('Error: ', err)
    res.status(500).json({ success: false, message: err || 'Something Went Wrong!' })
  }
}
