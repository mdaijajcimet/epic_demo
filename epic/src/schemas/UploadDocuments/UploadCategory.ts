import { graphql, list } from '@keystone-6/core'
import { integer, relationship, text, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { FORM_OPTION_KEYS, TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { validateMultiRelations } from '../Common/utils/relationshipValidators'
import { uploadSchemaKeyField } from './utils'

const UploadCategory = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: text({ validation: { isRequired: true } }),
    key: uploadSchemaKeyField(FORM_OPTION_KEYS.UPLOAD_CATEGORY),
    documents: relationship({ ref: 'UploadDocument', many: true }),
    infoText: text({ ui: { displayMode: 'textarea' } }),
    requiredLength: integer({
      label: 'No. of documents required',
      ui: {
        description: `\nIf linked required documents is greater than this value, it'll be overriden.\n Useful when you want user to attach at least one of the optional documents`,
      },
      defaultValue: 1,
      validation: { isRequired: true, min: 1 },
    }),
    mappedDocuments: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, unknown>, _args, context) {
          const id = item?.id?.toString()
          const docCountMap = { required: 0, optional: 0 }
          if (id) {
            const data = (await context.query?.UploadCategory.findOne({
              where: {
                id,
              },
              query: 'documents { isRequired } ',
            })) as Category
            type Category = {
              documents: Array<{ isRequired: boolean }>
            }
            if (data.documents.length) {
              const documents = data.documents
              docCountMap.required = documents.filter((document) => document.isRequired).length
              docCountMap.optional = documents.length - docCountMap.required
            }
          }
          return `Required: ${docCountMap.required}, Optional: ${docCountMap.optional}`
        },
      }),
    }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    validate: async (args) => {
      if (args.operation === 'delete') return
      validateMultiRelations<'list'>(args, ['documents'])
    },
    afterOperation: (args) => registerAuditLog(args),
  },
  ui: {
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.UploadCategory),
  },
})

export default UploadCategory
