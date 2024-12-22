import { every, get, some } from 'lodash'

import type { Role, Session } from '../../../types'
import {
  BASIC_PERMISSION_OPTIONS_MAP,
  LIST_ACCESS_KEY_MAP,
  MODULE_PERMISSION_OPTIONS_MAP,
} from '../../config/access'
import { SUPER_ROLE_NAME } from '../../constants/access'
import validateApiKey from '../../libs/validateApiKey'
import type {
  AccessArgs,
  AccessModuleInput,
  AccessModules,
  AllModuleOptionKeys,
  AllPermissionsVal,
  BasicPermissionsKey,
} from '../../types/access'
import {
  hasModulePermissions,
  isBasicPermission,
  isListHasRestrictions,
  isModulePermission,
} from '../../types/access'
import type { Maybe } from '../../types/utils'

/*
  The basic level of access to the system is being signed in as a valid user. This gives you access
  to the Admin UI, access to your own User and Todo items, and read access to roles.
*/
export const isSignedIn = ({ session }: AccessArgs) => {
  return !!session
}

export const isSuperUser = ({ session, context }: AccessArgs) => {
  return (
    ((session || {}) as Session)?.data?.roles?.some((role) => role?.name === SUPER_ROLE_NAME) ||
    validateApiKey(context)
  )
}

export const isAccessAllowed = (
  permissionType: BasicPermissionsKey | AllModuleOptionKeys,
  accessArgs: AccessArgs,
  initModule?: AccessModuleInput, // since KS returns wrong listKey in session for ui.isHidden
) => {
  // full permission for ingestors
  const hasValidApiKey = isSuperUser(accessArgs)
  if (hasValidApiKey) return true

  const { session, listKey } = accessArgs

  let module: Maybe<AccessModuleInput> = initModule

  if (typeof module === 'object' && !(module.AND?.length || module.OR?.length)) module = null
  if (!module) module = (isListHasRestrictions(listKey) && LIST_ACCESS_KEY_MAP[listKey]) || null

  const moduleObj = typeof module === 'string' ? { AND: [module] } : module

  if (!moduleObj) return true

  let permissionVal: AllPermissionsVal | null = null
  let modulesArr: AccessModules[] = []
  if (isBasicPermission(permissionType)) {
    permissionVal = BASIC_PERMISSION_OPTIONS_MAP[permissionType].value
    modulesArr = moduleObj.AND ? moduleObj.AND : moduleObj.OR
  } else {
    const moduleWithPermission = [...(moduleObj.OR ?? moduleObj.AND)].find(
      (m) => hasModulePermissions(m) && isModulePermission<typeof m>(m, permissionType),
    )
    if (moduleWithPermission)
      permissionVal =
        get(MODULE_PERMISSION_OPTIONS_MAP, `${moduleWithPermission}.${permissionType}.value`) ?? permissionVal
    modulesArr = [...(moduleObj.AND ? moduleObj.AND : moduleObj.OR)].filter(
      (m) =>
        hasModulePermissions(m) && isModulePermission<typeof m>(m, permissionType as AllModuleOptionKeys),
    )
  }

  const checkFn = moduleObj.AND ? every : some
  return !!(
    permissionVal &&
    checkFn(modulesArr, (m) => {
      const modulePermissions: Array<AllPermissionsVal> =
        (session?.data?.roles as Session['data']['roles'])
          ?.map((role: Role) => role?.[m])
          .flat(1)
          .filter(Boolean) ?? []
      return !!modulePermissions?.includes(permissionVal)
    })
  )
}
