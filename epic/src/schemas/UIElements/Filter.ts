import { list } from '@keystone-6/core'
import { relationship, text, checkbox, integer } from '@keystone-6/core/fields'
import registerAuditLog from '../../../registerAuditLog'

import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs, rules } from '../../utils/access'

const Filter = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: { query: rules.filterVerticalRelatedData },
  },
  fields: {
    title: text(),
    type: text(),
    placeholder: text(),
    formatter: checkbox(),
    aggregate: checkbox(),
    min: integer(),
    max: integer(),
    value: text(),
    collapsed: checkbox(),
    isApplied: checkbox(),
    attribute: relationship({ ref: 'Attribute', many: false }),
    elements: relationship({ ref: 'Filter', many: true }),
    vertical: relationship({ ref: 'Vertical' }),
    pages: relationship({ ref: 'Page', many: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Filter),
  },
})

export default Filter
