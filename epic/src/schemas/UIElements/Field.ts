import { list } from '@keystone-6/core'
import { relationship, text, checkbox } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { createdAtSchema, updatedAtSchema } from '../Common/common'

const Field = list({
  access: ModuleOpAccessArgs,
  fields: {
    key: text({ validation: { isRequired: true } }),
    name: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),
    title: text(),
    isDynamic: checkbox({ label: 'isDyanamic?' }),
    tooltip: text(),
    fields: relationship({ ref: 'Field', many: true }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Field),
  },
})

export default Field
