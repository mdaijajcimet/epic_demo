import { list } from '@keystone-6/core'
import { checkbox, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../../config/access'
import { TIMESTAMP_SCHEMA } from '../../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../../utils/access'

export const HospitalCover = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    description: text({ validation: { isRequired: true } }),
    productTiers: relationship({ ref: 'ProductTier.hospitalCovers', many: true, ui: { hideCreate: true } }),
    isEnabled: checkbox({ label: 'Enable/Disable', defaultValue: true }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.HospitalCover),
  },
})
