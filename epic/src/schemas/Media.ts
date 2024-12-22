import { list } from '@keystone-6/core'
import { file, text } from '@keystone-6/core/fields'
import mime from 'mime-types'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../utils/access'
import { copyMediaToS3 } from '../utils/s3'

export const Media = list({
  access: ModuleOpAccessArgs,
  graphql: {
    plural: 'MediaFiles',
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    file: file({
      storage: 'cimet_s3_media',
      hooks: {
        validateInput: ({ addValidationError, resolvedData }) => {
          const { filename, filesize } = resolvedData.file
          if (!filename) return
          const extension = filename.split('.')[1].toLowerCase() as string
          const baseSize = 1024 ** 2
          let msg = `\nPDF max size: 4MB \nOthers max size: 2MB`
          const allowedAudioVideoFormats = [
            'mp3',
            'aac',
            'wav',
            'flac',
            'ogg',
            'mp4',
            'mov',
            'avi',
            'mkv',
            'webm',
          ]
          let maxFileSize = extension === 'pdf' ? baseSize * 4 : baseSize * 2

          if (allowedAudioVideoFormats.includes(extension)) {
            maxFileSize = baseSize * 500
            msg = `\nFile size exceeds the maximum allowed limit of 500 MB.`
          }

          if (filesize > maxFileSize) addValidationError(msg)
        },
        afterOperation: async ({ resolvedData }) => {
          if (resolvedData?.file) {
            const {
              file: { filename },
            } = resolvedData
            if (filename) {
              const mimeType = mime.lookup(filename)
              if (mimeType) copyMediaToS3(filename, mimeType)
            }
          }
        },
      },
    }),
    linkUrl: text({ label: 'Link URL' }),
    altText: text(),
  },
  ui: {
    labelField: 'title',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Media),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
