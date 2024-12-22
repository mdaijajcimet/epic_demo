import { ALL_PERMISSION_VALUES } from '../../config/access'
import type {
  AccessArgs,
  AccessModuleInput,
  AccessModules,
  AllModuleOptionKeys,
  AllPermissionsVal,
  BasicPermissionsKey,
} from '../../types/access'
import { isAccessAllowed } from './common'

type PermissionArgs = [listAccessArgs: AccessArgs, module?: AccessModuleInput]

export const hasModulePermission = ALL_PERMISSION_VALUES.reduce(
  (acc, permissionType) => ({
    ...acc,
    [permissionType]: (...permissionArgs: PermissionArgs) =>
      isAccessAllowed(permissionType, ...permissionArgs),
  }),
  {} as Record<AllPermissionsVal, (...permissionArgs: PermissionArgs) => boolean>,
)

export const filterByPermission = (
  args: AccessArgs,
  modules: AccessModules[],
  permissionType: BasicPermissionsKey | AllModuleOptionKeys,
  isPresent = true,
) => {
  const hasPermission = hasModulePermission[permissionType]
  return modules.filter((module) => hasPermission(args, module) === isPresent)
}

export const hasSomePermission = (
  args: AccessArgs,
  modules: AccessModules[],
  permissionType: BasicPermissionsKey | AllModuleOptionKeys,
) => {
  const hasPermission = hasModulePermission[permissionType]
  return modules.some((module) => hasPermission(args, module))
}
