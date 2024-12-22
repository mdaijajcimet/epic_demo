import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import commonSpecialFields from '../Common/SpecialFields'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const PLSpecial = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLSpecial', 'Special'),
    personalLoan: relationship({ ref: 'PersonalLoan.specials', many: false, ui: readOnly({}, 'sidebar') }),
    ...commonSpecialFields,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Offer & Specials',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLSpecial, { hideCreate: true }),
  },
})

export default PLSpecial
