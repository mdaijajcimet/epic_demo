import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { createdAtSchema, updatedAtSchema } from '../Common/common'

const Component = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: text(),
    attributes: relationship({ ref: 'Attribute.component', many: true }),
    title: text(),
    tooltip: text(),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Component),
  },
})

export default Component
