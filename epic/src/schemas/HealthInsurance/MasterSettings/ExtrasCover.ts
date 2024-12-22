import { list } from '@keystone-6/core'
import { checkbox, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../../config/access'
import { TIMESTAMP_SCHEMA } from '../../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../../utils/access'

export const ExtrasCover = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    description: text({ validation: { isRequired: true } }),
    isEnabled: checkbox({ label: 'Enable/Disable', defaultValue: true }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.ExtrasCover),
  },
})
