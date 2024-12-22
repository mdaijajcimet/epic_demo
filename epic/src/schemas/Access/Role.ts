import { group, list } from '@keystone-6/core'
import { multiselect, relationship, text } from '@keystone-6/core/fields'
import { BaseListTypeInfo, FieldTypeFunc } from '@keystone-6/core/types'
import { reduce, values } from 'lodash'

import registerAuditLog from '../../../registerAuditLog'
import {
  ACCESS_MODULE_MAP,
  BASIC_PERMISSION_OPTIONS_MAP,
  LIST_ACCESS_KEY_MAP,
  MODULE_PERMISSION_OPTIONS_MAP,
} from '../../config/access'
import { SUPER_ROLE_NAME } from '../../constants/access'
import validateApiKey from '../../libs/validateApiKey'
import type { AccessModules, AllPermissionsVal } from '../../types/access'
import { hasModulePermissions as hasModuleSpecificPermission } from '../../types/access'
import {
  ModuleOpAccessArgs,
  getModuleUIArgs,
  hasModulePermission,
  isSignedIn,
  rules,
} from '../../utils/access'

type GroupInput = {
  label: string
  description: string
  fields: Partial<Record<AccessModules, FieldTypeFunc<BaseListTypeInfo>>>
}

const groupInputs = reduce(
  values(ACCESS_MODULE_MAP),
  (acc, currGroupData) => [
    ...acc,
    {
      label: `[Permissions] - ${currGroupData.groupLabel}`,
      description: 'Read permission is added by default if other access are given',
      fields: {
        ...reduce(
          values(currGroupData.modules),
          (acc, module) => ({
            ...acc,
            [module]: multiselect({
              options: [
                ...values(BASIC_PERMISSION_OPTIONS_MAP),
                ...(hasModuleSpecificPermission(module) ? values(MODULE_PERMISSION_OPTIONS_MAP[module]) : []),
              ],
              hooks: {
                resolveInput({ resolvedData }) {
                  const modulePermissions = addDefaultReadAccessToModule(resolvedData[module])
                  return modulePermissions
                },
              },
            }),
          }),
          {},
        ),
      },
    },
  ],
  [] as GroupInput[],
)

export const Role = list({
  access: {
    operation: {
      ...ModuleOpAccessArgs.operation,
      query: (args) => isSignedIn(args) || validateApiKey(args.context),
    },
    filter: {
      query: rules.canReadRoles,
    },
    item: {
      delete: (args) => {
        // prevents delete of super user
        return args.item?.name === SUPER_ROLE_NAME ? false : hasModulePermission.delete(args)
      },
    },
  },
  ui: {
    listView: {
      initialColumns: ['name', 'assignedTo'],
      defaultFieldMode(args) {
        return hasModulePermission.read(args, LIST_ACCESS_KEY_MAP.Role) ? 'read' : 'hidden'
      },
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Role, { isHidden: true }),
  },
  fields: {
    name: text({
      validation: { isRequired: true },
      hooks: {
        validateInput({ inputData, item, addValidationError }) {
          if (inputData?.name && item?.name === SUPER_ROLE_NAME)
            addValidationError(`You can't update role name for "${SUPER_ROLE_NAME}"`)
        },
      },
    }),
    assignedTo: relationship({
      ref: 'User.roles',
      many: true,
    }),
    ...groupInputs.reduce((acc, input) => ({ ...acc, ...group(input) }), {}),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

const addDefaultReadAccessToModule = (modulePermissions: AllPermissionsVal[]) => {
  return modulePermissions &&
    modulePermissions?.length &&
    !modulePermissions.includes?.(BASIC_PERMISSION_OPTIONS_MAP.read.value)
    ? [...modulePermissions, BASIC_PERMISSION_OPTIONS_MAP.read.value]
    : modulePermissions
}
