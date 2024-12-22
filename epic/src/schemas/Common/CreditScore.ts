import { list } from '@keystone-6/core'
import { integer, select, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const CreditScore = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    creditBureau: select({
      options: [
        {
          label: 'Equifax',
          value: 'equifax',
        },
        {
          label: 'Experian',
          value: 'experian',
        },
      ],
    }),
    scoreBand: select({
      options: [
        {
          label: 'Excellent',
          value: 'excellent',
        },
        {
          label: 'Very Good',
          value: 'very_good',
        },
        {
          label: 'Good',
          value: 'good',
        },
        {
          label: 'Average',
          value: 'average',
        },
        {
          label: 'Below Average',
          value: 'below_average',
        },
      ],
    }),
    minCreditScore: integer({ validation: { isRequired: true }, defaultValue: 0 }),
    maxCreditScore: integer({ validation: { isRequired: true }, defaultValue: 0 }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: getModuleUIArgs(LIST_ACCESS_KEY_MAP.CreditCard),
})

export default CreditScore
