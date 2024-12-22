import { graphql, list } from '@keystone-6/core'
import { checkbox, integer, text, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { FORM_OPTION_KEYS, TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { uploadSchemaKeyField } from './utils'

const UploadDocument = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item: Record<string, unknown>) {
          return item ? `${item.label} - ${item.isRequired ? 'Required' : 'Optional'}` : ''
        },
      }),
    }),
    label: text({ validation: { isRequired: true } }),
    key: uploadSchemaKeyField(FORM_OPTION_KEYS.UPLOAD_DOCUMENT),
    isRequired: checkbox({ label: 'required' }),
    order: integer(),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.UploadDocument),
  },
  hooks: {
    afterOperation: (data) => registerAuditLog(data),
  },
})

export default UploadDocument
