import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { parse } from 'csv-parse/sync'
import { type Request, type Response } from 'express'
import uniqBy from 'lodash/uniqBy'
import { createInverterData, createManufacturers, createSolarPanelData, formatData } from '../../utils'
import { extractFileFromReq } from './common'

export const importSolarData = async (
  req: Request,
  res: Response,
  createContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  try {
    const context = await createContext.withRequest(req, res)
    const file = extractFileFromReq(req)?.data
    if (file && req.body) {
      let result: any
      const type = req.body['type']

      let headers = ['manufacturer', 'modelNumber', 'approveDate', 'expiryDate']

      if (type === 'inverter') {
        headers = ['manufacturer', 'series', 'modelNumber', 'powerRating', 'approveDate', 'expiryDate']
      }

      let records = parse(file, {
        columns: headers,
        skip_empty_lines: true,
        from_line: 2,
        trim: true,
      })

      if (records?.length) {
        records = records.filter(({ ...item }) => item)

        records = uniqBy(records, 'modelNumber')

        await createManufacturers(records, context)

        if (type === 'solar') {
          const updatedList = await formatData(records, context)
          result = await createSolarPanelData(updatedList, context)
        } else if (type === 'inverter') {
          const updatedList = await formatData(records, context)
          result = await createInverterData(updatedList, context)
        }
        if (result.length) {
          res.status(201).json({ message: 'Created Successfully!', count: result.length, data: result })
        } else {
          res.status(200).json({ message: 'Data Exist Already!' })
        }
      } else {
        res.status(400).json({ message: 'No Records Found!' })
      }
    } else {
      res.status(400).json({ message: 'File Not found!' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Something Went Wrong!' })
  }
}
