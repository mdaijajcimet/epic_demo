import { ACCESS_MODULE_MAP, LIST_ACCESS_KEY_MAP } from '../config/access'
import { ListKey } from '../types'
import { AccessModules } from '../types/access'
import { VERTICAL_KEYS } from './verticals'

export const SUPER_ROLE_NAME = 'Super User'

export const accessModules: AccessModules[] = Object.values(ACCESS_MODULE_MAP)
  .map((group) => Object.values(group.modules))
  .flat(1)

export const LIST_GROUPS = Object.entries(LIST_ACCESS_KEY_MAP).reduce((acc, [listKey, accessModule]) => {
  if (typeof accessModule === 'string') {
    if (acc[accessModule]) acc[accessModule].push(listKey as ListKey)
    else acc[accessModule] = [listKey as ListKey]
  } else if (accessModule.AND) {
    const vertical = accessModule.AND.find((module) => VERTICAL_KEYS.includes(module))
    if (vertical) {
      if (acc[vertical]) acc[vertical]?.push(listKey as ListKey)
      else acc[vertical] = [listKey as ListKey]
    }
  }
  return acc
}, {} as Record<AccessModules, Partial<ListKey>[]>)
