import { list } from '@keystone-6/core'
import { float, relationship, select, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const StateWiseRebate = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    state: relationship({ ref: 'State', many: false }),
    rebateType: select({
      options: [
        { label: 'Solar Panel', value: 'solarPanel' },
        { label: 'Inverter', value: 'inverter' },
        { label: 'Battery', value: 'battery' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
      validation: { isRequired: true },
    }),
    amount: float({ validation: { isRequired: true } }),
    condition: text({ ui: { displayMode: 'textarea' } }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.StateWiseRebate),
  },
})

export default StateWiseRebate
