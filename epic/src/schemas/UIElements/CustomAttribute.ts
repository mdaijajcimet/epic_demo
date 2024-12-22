import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const CustomAttribute = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    attribute: relationship({
      ref: 'Attribute',
      ui: { labelField: 'key' },
      many: false,
    }),
    headerTooltip: text(),
    infoTooltip: text(),
    formatter: text(),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CustomAttribute),
  },
})

export default CustomAttribute
