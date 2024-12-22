import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { perkFields, verticalLabelVirtualField } from '../Common/utils/schema'

const PLPerk = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLPerk', 'Perk'),
    personalLoan: relationship({ ref: 'PersonalLoan.perks', many: false, ui: readOnly({}, 'sidebar') }),
    ...perkFields,
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Perks',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLPerk, { hideCreate: true }),
  },
})

export default PLPerk
