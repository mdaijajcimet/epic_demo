import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { getModuleUIArgs, ModuleOpAccessArgs } from '../../utils/access'
import { perkFields, verticalLabelVirtualField } from '../Common/utils/schema'

const CCPerk = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'CCPerk', 'Perk'),
    ...perkFields,
    creditCard: relationship({ ref: 'CreditCard.perks', many: false, ui: readOnly({}, 'sidebar') }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Perks',
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CCPerk, { hideCreate: true }),
  },
})

export default CCPerk
