/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { type Request, type Response } from 'express'

export const getTableData = async (
  req: Request,
  res: Response,
  createContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  try {
    const context = (await createContext.withRequest(req, res)) as KeystoneContext<BaseKeystoneTypeInfo>
    const { table, where = {} } = req.body || {}
    if (!table) {
      return res.status(400).json({ success: false, message: 'Table Name is missing' })
    }

    const data = await context.prisma?.[table].findMany({ where })
    res.status(200).json({ success: true, data: data })
  } catch (err) {
    console.error('Error: ', err)
    res.status(500).json({ success: false, message: 'Something Went Wrong!' })
  }
}
