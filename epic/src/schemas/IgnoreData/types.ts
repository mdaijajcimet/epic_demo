import { FieldHooks } from '@keystone-6/core/types'
import { BaseListTypeInfo, ListHooks as KeystoneListHooks } from '@keystone-6/core/types'
import { TypeInfo } from '.keystone/types'

export type UpdatedItem = {
  id: string
  connect?: { id: string }[]
  disconnect?: { id: string }[]
}

type FieldsMap = {
  type: TypeInfo['lists']['IgnoreType']['fields']
  parameter: TypeInfo['lists']['IgnoreParameter']['fields']
  list: TypeInfo['lists']['IgnoreList']['fields']
}

export type ListHooks<T extends keyof FieldsMap> = {
  list?: KeystoneListHooks<BaseListTypeInfo>
  fields?: Partial<Record<FieldsMap[T], FieldHooks<BaseListTypeInfo>>>
}
