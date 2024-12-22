import type { AccessModules, AllPermissionsVal } from './src/types/access'

export type Role = {
  id: string
  name: string
} & Record<AccessModules, AllPermissionsVal[]>

export type Session = {
  itemId: string
  listKey: string
  data: {
    id: string
    name: string
    // will not present in UI user data
    assignedDomains?: { id: string }[]
    roles?: Role[]
  }
}
