import { parse } from 'csv-parse/sync'
import { type Request, type Response } from 'express'

import { createPages } from '../../utils'
import { extractFileFromReq } from './common'

export const importPages = async (req: Request, res: Response, createContext: any) => {
  try {
    const context = await createContext.withRequest(req, res)
    const { table, domain, vertical } = req.body
    if (!table || !domain || !vertical) {
      res.status(400).json({ message: 'Data is missing' })
      return
    }
    const options = {
      table,
      domain,
      vertical,
      filterKey: 'slug',
    }
    const file = extractFileFromReq(req)?.data

    if (file) {
      const records = parse(file, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })

      if (records?.length) {
        await createPages(records, context, options)
      } else {
        res.status(400).json({ message: 'No Records Found!' })
      }
    } else {
      res.status(400).json({ message: 'File Not found!' })
    }
    res.json({ message: 'Created Successfully!' })
  } catch (err) {
    console.error('Error: ', err)
    res.status(500).json({ message: 'Something Went Wrong!' })
  }
}
