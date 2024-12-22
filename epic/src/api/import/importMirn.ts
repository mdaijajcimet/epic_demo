/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { type Request, type Response } from 'express'

import { handleCatchErr } from '../../utils'
import { uploadPreSignedUrl } from '../../utils/s3'

export const mirnPresignUrl = async (
  req: Request,
  res: Response,
  commonContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  try {
    const fileName = req.body?.fileName

    const context = await commonContext.withRequest(req, res)

    const existingFile = await context.prisma.mirn.findUnique({
      where: {
        fileName,
      },
    })

    if (existingFile) {
      return res.status(200).json({
        isDuplicateFile: true,
      })
    }
    const uploadUrl = await uploadPreSignedUrl({
      bucket: process.env.S3_MIRN_BUCKET || '',
      keyName: fileName,
    })
    res.status(200).json({
      uploadUrl,
    })
  } catch (err) {
    handleCatchErr(err, res)
  }
}
