import { list } from '@keystone-6/core'
import { float, select, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const HIRebate = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    ageGroup: select({
      options: [
        { label: 'Age < 65', value: '18-64' },
        { label: 'Age 65-69', value: '65-69' },
        { label: 'Age 70+', value: '70-100' },
      ],
      validation: { isRequired: true },
    }),
    tier: select({
      options: [
        { label: 'Base Tier', value: 'tier-0' },
        { label: 'Tier 1', value: 'tier-1' },
        { label: 'Tier 2', value: 'tier-2' },
        { label: 'Tier 3', value: 'tier-3' },
      ],
      validation: { isRequired: true },
    }),
    rebate: float({ validation: { isRequired: true } }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Rebates',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.HIProvider),
  },
})

export default HIRebate
