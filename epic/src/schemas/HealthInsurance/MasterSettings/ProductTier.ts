import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../../config/access'
import { TIMESTAMP_SCHEMA } from '../../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../../utils/access'

export const ProductTier = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    hospitalCovers: relationship({ ref: 'HospitalCover.productTiers', many: true }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.ProductTier),
  },
})
