/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { TariffCode } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import { type Request, type Response } from 'express'
import uniqBy from 'lodash/uniqBy'
import {
  TARIFF_CODE_HEADERS,
  TARIFF_CODE_TABLE_NAME,
  TariffCodeVertical,
} from '../../../admin/constants/config'
import { ErrorWithStatusCode } from '../../libs/errors'
import { handleCatchErr } from '../../utils'
import { extractFileFromReq } from './common'

export const importTariffCodes = async (
  req: Request,
  res: Response,
  commonContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  const context = await commonContext.withRequest(req, res)
  try {
    const fileData = extractFileFromReq(req)
    if (fileData && req.body) {
      const { data: file, name: filename, mimetype } = fileData
      if (mimetype !== 'text/csv') {
        throw new ErrorWithStatusCode('Only .csv supported!', 400)
      }

      const vertical = req.body['vertical'] as TariffCodeVertical

      if (!vertical) {
        res.status(400).json({ message: 'Must provide vertical!' })
      }

      let records = parse(file, {
        columns: TARIFF_CODE_HEADERS[vertical],
        skip_empty_lines: true,
        from_line: 2,
        trim: true,
        on_record(record) {
          if (Object.values(record).some((val) => !val)) {
            throw new ErrorWithStatusCode('One of the fields is empty!', 400)
          }
          return record
        },
      }) as TariffCode[]
      if (records?.length) {
        records = records.map((item) => ({ ...item, vertical }))

        records = uniqBy(records, 'tariffCode')

        // delete old records
        await context.prisma.tariffCode.deleteMany({
          where: {
            vertical: { equals: vertical },
          },
        })
        // add new tariff codes
        const { count } = await context.prisma.tariffCode.createMany({
          data: records,
        })
        await context.prisma.auditLog.create({
          data: {
            actionType: vertical,
            docId: filename,
            userId: context.session?.data?.id,
            username: context.session?.data?.name,
            collectionName: TARIFF_CODE_TABLE_NAME,
            oldValue: '',
            newValue: `uploaded ${filename}`,
          },
        })
        res.status(201).json({ message: `${count} Tariff codes added to system successfully!` })
        return
      } else {
        res.status(400).json({ message: 'No Records Found!' })
        return
      }
    } else {
      res.status(400).json({ message: 'File Not found!' })
      return
    }
  } catch (err) {
    handleCatchErr(err, res)
  }
}
