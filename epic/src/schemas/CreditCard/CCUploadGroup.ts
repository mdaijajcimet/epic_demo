import { list } from '@keystone-6/core'
import { integer, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { FORM_OPTION_KEYS, TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { validateMultiRelations } from '../Common/utils/relationshipValidators'
import { uploadSchemaKeyField } from '../UploadDocuments/utils'

const CCUploadGroup = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: text({ validation: { isRequired: true } }),
    key: uploadSchemaKeyField(FORM_OPTION_KEYS.CC_UPLOAD_GROUP),
    categories: relationship({ ref: 'UploadCategory', many: true }),
    order: integer(),
    provider: relationship({
      ref: 'ProviderCreditCard.uploadGroup',
      many: true,
      ui: readOnly({}, 'sidebar'),
    }),
    creditCard: relationship({
      ref: 'CreditCard.uploadGroup',
      many: true,
      ui: readOnly({}, 'sidebar'),
    }),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    label: 'Upload Group',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CCUploadGroup, { hideCreate: true }),
  },
  hooks: {
    async validate(args) {
      if (args.operation === 'delete') return
      await validateMultiRelations<'list'>(args, ['categories'])
    },
    afterOperation: (args) => registerAuditLog(args),
  },
})

export default CCUploadGroup
