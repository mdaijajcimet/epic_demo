import type { ListUI } from '../../types'
import type { AccessModuleInput } from '../../types/access'
import { hasModulePermission } from './methods'

// todo: rename to ListOpAccessMap
export const ModuleOpAccessArgs = {
  operation: {
    query: hasModulePermission.read,
    create: hasModulePermission.write,
    update: hasModulePermission.write,
    delete: hasModulePermission.delete,
  },
}

export const getModuleUIArgs = (
  module: AccessModuleInput,
  overrides?: Pick<ListUI, 'hideCreate' | 'hideDelete' | 'isHidden'> & {
    fieldMode?: 'edit' | 'hidden'
    itemFieldMode?: 'edit' | 'read' | 'hidden'
  },
  cb?: (val: any) => any,
): ListUI => ({
  isHidden:
    overrides?.isHidden ??
    ((args) => {
      const isRead = hasModulePermission.read(args, module)

      if (cb) cb(isRead)
      return !isRead
    }),
  hideCreate: overrides?.hideCreate ?? ((args) => !hasModulePermission.write(args, module)),
  hideDelete: overrides?.hideDelete ?? ((args) => !hasModulePermission.delete(args, module)),
  createView: {
    defaultFieldMode:
      overrides?.fieldMode ?? ((args) => (hasModulePermission.write(args, module) ? 'edit' : 'hidden')),
  },
  itemView: {
    defaultFieldMode:
      overrides?.itemFieldMode ??
      ((args) =>
        hasModulePermission.write(args, module)
          ? 'edit'
          : hasModulePermission.read(args, module)
          ? 'read'
          : 'hidden'),
  },
})
