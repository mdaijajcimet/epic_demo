import { graphql, list } from '@keystone-6/core'
import { text, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../utils/access'

const Member = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, unknown>) {
          return `${item?.name} (${item?.email})`
        },
      }),
    }),
    name: text(),
    title: text(),
    email: text({ isIndexed: 'unique' }),
    roles: text(),
  },
  ui: {
    labelField: 'label',
    listView: {
      defaultFieldMode: 'read',
      initialColumns: ['name', 'label', 'email', 'role'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Member, {
      hideCreate: true,
      hideDelete: true,
      fieldMode: 'hidden',
      itemFieldMode: 'read',
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
export default Member
