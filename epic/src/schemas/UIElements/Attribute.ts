import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs, rules } from '../../utils/access'
import { createdAtSchema, updatedAtSchema } from '../Common/common'

const Attribute = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: { query: rules.filterVerticalRelatedData },
  },
  fields: {
    title: text(),
    key: text({ isIndexed: 'unique' }),
    vertical: relationship({ ref: 'Vertical', many: false }),
    component: relationship({ ref: 'Component.attributes', many: false }),
    tooltip: text(),
    formatter: text(),
    formatterOptions: text(),
    fields: relationship({ ref: 'Field', many: true }),
    attributes: relationship({ ref: 'Attribute', many: true }),
    containers: relationship({ ref: 'Container.attributes', many: true }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Attribute),
  },
})

export default Attribute
