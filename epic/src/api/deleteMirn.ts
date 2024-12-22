/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { type Request, type Response } from 'express'

import { deleteObject } from '../utils/s3'
import { PRISMA_CODE_ITEM_NOT_FOUND } from '../constants/common'

export const deleteMirn = async (
  req: Request,
  res: Response,
  commonContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  try {
    const fileName = req?.body?.fileName

    if (!fileName) {
      return res.status(400).json({ message: 'fileName for deleting file not found!' })
    }

    const context = await commonContext.withRequest(req, res)

    await deleteObject({ bucket: process.env.S3_MIRN_BUCKET || '', keyName: fileName })

    try {
      await context.prisma.mirn.delete({
        where: {
          fileName,
        },
      })
    } catch (err: any) {
      if (err.code !== PRISMA_CODE_ITEM_NOT_FOUND) throw err
    }

    res.status(200).json({
      success: true,
    })
  } catch (err: any) {
    console.error(err.message)
    res.status(400).send({ success: false, message: err.message || 'Something went wrong' })
  }
}
