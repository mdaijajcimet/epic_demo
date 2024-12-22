import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { eligibiltyFields, verticalLabelVirtualField } from '../Common/utils/schema'

const CCEligibility = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'CCEligibility', 'Eligibility'),
    creditCard: relationship({ ref: 'CreditCard.eligibility', many: false, ui: readOnly({}, 'sidebar') }),
    ...eligibiltyFields,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Eligibility Criteria',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CCEligibility, { hideCreate: true }),
  },
})

export default CCEligibility
