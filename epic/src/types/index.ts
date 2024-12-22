import type { TypeInfo } from '.keystone/types'
import type {
  BaseListTypeInfo,
  CommonFieldConfig,
  KeystoneConfig,
  KeystoneContextFromListTypeInfo,
  FieldHooks as KeystoneFieldHooks,
  ListHooks as KeystoneListHooks,
} from '@keystone-6/core/types'

export type RelField = {
  refListKey: any
  many: any
  refFieldKey: any
  refLabelField: string
}
export type PrimitiveField = {
  validation: any
}

type UniqueWhereInput<ListTypeInfo extends BaseListTypeInfo> = false extends ListTypeInfo['isSingleton']
  ? { readonly where: ListTypeInfo['inputs']['uniqueWhere'] }
  : { readonly where?: ListTypeInfo['inputs']['uniqueWhere'] }

export type Data = (UniqueWhereInput<BaseListTypeInfo> & {
  readonly data: BaseListTypeInfo['inputs']['update']
})[]

export type UpdateManyArgs = {
  readonly data: Data
} & { select?: Record<string, any> }

export type Context = KeystoneContextFromListTypeInfo<BaseListTypeInfo>

export type GQLCommonArgs = {
  context: Context
  listKey: string
}

export type DeleteManyArgs = {
  ids: Array<any>
}

export type HookMap = {
  list: KeystoneListHooks<BaseListTypeInfo>
  field: KeystoneFieldHooks<BaseListTypeInfo>
}

type ResolveInput = Extract<
  Exclude<HookMap['list']['resolveInput'], undefined>,
  {
    create?: any // Using any to match any type for ResolveInputListHook
    update?: any // Using any to match any type for ResolveInputListHook
  }
>['create' | 'update']

// todo: update for object hook types
export type Hook<T extends keyof HookMap, U extends keyof HookMap[T]> = T extends 'list'
  ? U extends 'resolveInput'
    ? Exclude<ResolveInput, undefined>
    : Exclude<HookMap[T][U], undefined>
  : Exclude<HookMap[T][U], undefined>

type ExtractParameters<T> = T extends (...args: any) => any ? Parameters<T> : never

export type ListHookFuncArgs<U extends keyof HookMap['list']> = Hook<'list', U> extends infer A
  ? ExtractParameters<A>
  : never

export type Option = { label: string; value: string }
export type Options = Option[]

export type ListUI = Exclude<KeystoneConfig['lists'][keyof KeystoneConfig['lists']]['ui'], undefined>
export type ListKey = keyof TypeInfo<any>['lists']
export type FieldKey<T extends ListKey> = TypeInfo<any>['lists'][T]['fields']
export type ListTypeInfo = TypeInfo['lists'][ListKey]

export type FieldConfig<T extends keyof CommonFieldConfig<BaseListTypeInfo>> = Pick<
  CommonFieldConfig<BaseListTypeInfo>,
  T
>[T]
export type CustomFieldsConfig<Config extends Record<string, unknown>> = {
  [L in ListKey]: Partial<{
    [F in FieldKey<L>]: Config
  }>
}
