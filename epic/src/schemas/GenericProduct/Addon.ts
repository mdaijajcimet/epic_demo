import { list } from '@keystone-6/core'
import { text, relationship } from '@keystone-6/core/fields'
import { allowAll } from '@keystone-6/core/access'

import { createdAtSchema, updatedAtSchema } from '../Common/common'
import registerAuditLog from '../../../registerAuditLog'

const GenericAddon = list({
  access: allowAll,
  fields: {
    addonName: text({ validation: { isRequired: true } }),
    price: text({ validation: { isRequired: true } }),
    plans: relationship({ ref: 'GenericPlan.addons', many: true }),
    provider: relationship({ ref: 'GenericProvider.addons', many: false }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  ui: {
    labelField: 'addonName',
    isHidden: true,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

export default GenericAddon
