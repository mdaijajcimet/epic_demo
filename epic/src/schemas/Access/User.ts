import { group, list } from '@keystone-6/core'
import { password, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import validateApiKey from '../../libs/validateApiKey'
import { FieldConfig } from '../../types'
import { getModuleUIArgs, hasModulePermission, isSignedIn, rules } from '../../utils/access'
import { hasPagePermission } from '../Page/utils'

type Args = {
  ui?: FieldConfig<'ui'>
  access?: FieldConfig<'access'>
}
/** restricts write permission to people manager  */
export const authorizePeopleManager = ({ ui, access }: Partial<Args> = {}): Args => ({
  access: {
    create: hasModulePermission.write,
    update: hasModulePermission.write,
    ...access,
  },
  ui: {
    itemView: {
      fieldMode: (args) => (hasModulePermission.write(args, LIST_ACCESS_KEY_MAP.User) ? 'edit' : 'read'),
    },
    ...ui,
  },
})

export const User = list({
  access: {
    operation: {
      query: (args) => isSignedIn(args) || validateApiKey(args.context),
      create: hasModulePermission.write,
      update: (args) => hasModulePermission.write(args) || isSignedIn(args),
      delete: hasModulePermission.delete,
    },
    filter: {
      query: rules.canReadPeople,
      update: rules.canUpdatePeople,
      delete: rules.canDeletePeople,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      isFilterable: true,
      ...authorizePeopleManager(),
    }),
    password: password({ validation: { isRequired: true } }),
    pages: relationship({
      label: 'Authored Pages',
      ref: 'Page.author',
      many: true,
      ui: {
        itemView: {
          fieldMode(args) {
            return hasPagePermission(args, ['editor', 'publisher']) ? 'edit' : 'read'
          },
        },
      },
    }),
    ...group({
      label: 'Permissions',
      fields: {
        /* The role assigned to the user */
        roles: relationship({
          label: 'Assigned Roles',
          ref: 'Role.assignedTo',
          many: true,
          ...authorizePeopleManager(),
        }),
        assignedDomains: relationship({
          ref: 'Domain',
          many: true,
          ...authorizePeopleManager(),
        }),
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'pages'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.User, { itemFieldMode: 'edit' }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
