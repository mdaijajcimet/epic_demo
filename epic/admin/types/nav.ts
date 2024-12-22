import type { ListMeta } from '@keystone-6/core/types'
import type { AccessModuleInput, AllPermissionsVal } from '../../src/types/access'

export type CustomNavList = Partial<ListMeta> & {
  label: string
  path: string
  icon?: React.ForwardRefExoticComponent<React.SVGAttributes<SVGSVGElement>>
  access?: AccessModuleInput[]
  accessType?: AllPermissionsVal
}
