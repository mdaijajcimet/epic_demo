/* eslint-disable @typescript-eslint/no-unused-vars */
import { ALL_PERMISSION_VALUES, LIST_ACCESS_KEY_MAP } from '../../config/access'
import { FIELD_ACCESS_KEY_MAP } from '../../config/access/fieldAccess'
import type { FieldConfig, FieldKey, ListKey } from '../../types'
import type { AllPermissionsVal, FieldAccessArgs } from '../../types/access'
import { isSuperUser } from './common'
import { hasModulePermission } from './methods'

type PermissionArgs<L extends ListKey, F extends FieldKey<L>> = [
  args: FieldAccessArgs,
  listKey?: L,
  fieldKey?: F,
]

type IsFieldAccessibleProps<L extends ListKey, F extends FieldKey<L>> = {
  args: FieldAccessArgs
  listKey?: L
  fieldKey?: F
  permissionType: AllPermissionsVal
}

export const isFieldAccessible = <L extends ListKey, F extends FieldKey<L>>({
  args,
  permissionType,
  listKey: initialListKey,
  fieldKey: initialFieldKey,
}: IsFieldAccessibleProps<L, F>): boolean => {
  if (isSuperUser(args)) return true

  const listKey = initialListKey || (args.listKey as L)
  const fieldKey = initialFieldKey || (args.fieldKey as F)
  if (!listKey || !fieldKey) return false

  const hasListAccess = hasModulePermission[permissionType](args, LIST_ACCESS_KEY_MAP[listKey])
  if (!hasListAccess) return false

  const listFields = FIELD_ACCESS_KEY_MAP[listKey]
  const fieldAccessConfig =
    (listFields && fieldKey in listFields && fieldKey in listFields && listFields[fieldKey]) || null
  if (!fieldAccessConfig) return true

  return hasModulePermission[permissionType](args, fieldAccessConfig.accessCondition)
}

export const hasFieldPermission = ALL_PERMISSION_VALUES.reduce(
  (acc, permissionType) => ({
    ...acc,
    [permissionType]: <L extends ListKey, F extends FieldKey<L>>(...args: PermissionArgs<L, F>) =>
      isFieldAccessible({ permissionType, args: args[0], listKey: args[1], fieldKey: args[2] }),
  }),
  {} as Record<
    AllPermissionsVal,
    <L extends ListKey, F extends FieldKey<L>>(...permissionArgs: PermissionArgs<L, F>) => boolean
  >,
)

export const FieldAccessMap = {
  read: hasFieldPermission.read,
  create: hasFieldPermission.write,
  update: hasFieldPermission.write,
}

export const getFieldAccessUI = <L extends ListKey, F extends FieldKey<L>>(
  listKey: L,
  fieldKey: F,
  overrides?: Partial<{
    createFieldMode: 'edit' | 'hidden'
    listFieldMode: 'hidden' | 'read'
    itemFieldMode: 'edit' | 'hidden' | 'read'
  }>,
): FieldConfig<'ui'> => ({
  createView: {
    fieldMode:
      overrides?.createFieldMode ??
      ((args) => (hasFieldPermission.write(args, listKey, fieldKey) ? 'edit' : 'hidden')),
  },
  itemView: {
    fieldMode:
      overrides?.itemFieldMode ??
      ((args) =>
        hasFieldPermission.write(args, listKey, fieldKey)
          ? 'edit'
          : hasFieldPermission.read(args, listKey, fieldKey)
          ? 'read'
          : 'hidden'),
  },
  listView: {
    fieldMode:
      overrides?.listFieldMode ??
      ((args) => (hasFieldPermission.read(args, listKey, fieldKey) ? 'read' : 'hidden')),
  },
})
