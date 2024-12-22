import { list } from '@keystone-6/core'
import { integer, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../../config/access'
import { TIMESTAMP_SCHEMA } from '../../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../../utils/access'

export const PaymentFrequency = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    numOfDays: integer({ validation: { isRequired: true, min: 1 } }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PaymentFrequency),
  },
})
