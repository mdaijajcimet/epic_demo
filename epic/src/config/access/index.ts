import type { AllModulePermissionOptions, AllPermissionsVal } from '../../types/access'
import type { ExtractOptionValues } from '../../types/utils'
import { ACCESS_MODULE_MAP } from './accessModules'
import { BASIC_PERMISSION_OPTIONS_MAP, MODULE_PERMISSION_OPTIONS_MAP } from './accessOptions'
import { LIST_ACCESS_KEY_MAP } from './listAccess'
import { LMS_VERTICAL_ACCESS } from './verticalAccess'

const ALL_PERMISSION_VALUES: AllPermissionsVal[] = [
  ...Object.values(BASIC_PERMISSION_OPTIONS_MAP).map((item) => item.value),
  ...Object.values(MODULE_PERMISSION_OPTIONS_MAP).reduce(
    (acc, item) => [...acc, ...Object.values(item).map((subItem) => subItem.value)],
    [] as ExtractOptionValues<AllModulePermissionOptions>[],
  ),
]

export {
  ACCESS_MODULE_MAP,
  ALL_PERMISSION_VALUES,
  BASIC_PERMISSION_OPTIONS_MAP,
  LIST_ACCESS_KEY_MAP,
  LMS_VERTICAL_ACCESS,
  MODULE_PERMISSION_OPTIONS_MAP,
}
