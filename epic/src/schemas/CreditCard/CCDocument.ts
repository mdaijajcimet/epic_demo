import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const CCDocument = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'CCDocument', 'Document'),
    creditCard: relationship({ ref: 'CreditCard.documents', many: false, ui: readOnly({}, 'sidebar') }),
    keyFactSheet: relationship({ ref: 'Media', many: false }),
    targetMarketDetermination: relationship({ ref: 'Media', many: false }),
    document: relationship({
      ref: 'Media',
      many: true,
      ui: {
        description: 'upload document or add the document url',
      },
    }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Documents',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CCDocument, { hideCreate: true }),
  },
})

export default CCDocument
