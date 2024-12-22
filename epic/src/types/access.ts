import type { BaseListTypeInfo, KeystoneContext } from '@keystone-6/core/types'

import {
  ACCESS_MODULE_MAP,
  BASIC_PERMISSION_OPTIONS_MAP,
  LIST_ACCESS_KEY_MAP,
  MODULE_PERMISSION_OPTIONS_MAP,
} from '../config/access'
import type { ExtractKeys, ExtractOptionValues, ExtractValues } from './utils'

// type defs -------------

export type AccessArgs = {
  listKey?: string
  session?: BaseListTypeInfo['all']['session']
  context?: KeystoneContext<any>
  item?: BaseListTypeInfo['item']
}

export type FieldAccessArgs = AccessArgs & {
  operation?: 'create' | 'read' | 'update'
  fieldKey?: string
  inputData?: BaseListTypeInfo['inputs']['update'] | BaseListTypeInfo['inputs']['create']
}

export type BasicPermissionsKey = keyof typeof BASIC_PERMISSION_OPTIONS_MAP

type ModulesWithExtraPermissions = keyof typeof MODULE_PERMISSION_OPTIONS_MAP

type ModulePermissionOptions<T extends ModulesWithExtraPermissions> =
  (typeof MODULE_PERMISSION_OPTIONS_MAP)[T]

export type AllModulePermissionOptions = ModulePermissionOptions<ModulesWithExtraPermissions>

export type AllModuleOptionKeys = ExtractKeys<AllModulePermissionOptions>

export type AllPermissionsVal =
  | ExtractOptionValues<typeof BASIC_PERMISSION_OPTIONS_MAP>
  | ExtractOptionValues<AllModulePermissionOptions>

// type guards -------------
export function hasModulePermissions(module: string): module is keyof typeof MODULE_PERMISSION_OPTIONS_MAP {
  return module in MODULE_PERMISSION_OPTIONS_MAP
}

export function isBasicPermission(permissionType: string): permissionType is BasicPermissionsKey {
  return permissionType in BASIC_PERMISSION_OPTIONS_MAP
}

export function isModulePermission<T extends ModulesWithExtraPermissions>(
  module: T,
  permissionType: AllModuleOptionKeys,
): permissionType is ExtractKeys<ModulePermissionOptions<T>> {
  return Object.keys(MODULE_PERMISSION_OPTIONS_MAP[module]).includes(permissionType)
}

export type AccessModuleGroups = typeof ACCESS_MODULE_MAP

export type AccessGroups = AccessModuleGroups[keyof AccessModuleGroups]

export type AccessModules = ExtractValues<AccessGroups['modules']>

export type AccessModuleInput =
  | AccessModules
  | {
      AND: AccessModules[]
      OR?: null
    }
  | {
      OR: AccessModules[]
      AND?: null
    }

export function isListHasRestrictions(listKey?: string): listKey is keyof typeof LIST_ACCESS_KEY_MAP {
  return !!(listKey && listKey in LIST_ACCESS_KEY_MAP)
}
export type VerticalModule = keyof (typeof ACCESS_MODULE_MAP.verticals)['modules']
