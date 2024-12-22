import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const PLDocument = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLDocument', 'Document'),
    keyFactSheet: relationship({ ref: 'Media', many: false }),
    targetMarketDetermination: relationship({ ref: 'Media', many: false }),
    document: relationship({
      ref: 'Media',
      many: true,
      ui: {
        description: 'Upload document or add document url',
      },
    }),
    personalLoan: relationship({ ref: 'PersonalLoan.documents', many: false, ui: readOnly({}, 'sidebar') }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Documents',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLDocument, { hideCreate: true }),
  },
})

export default PLDocument
