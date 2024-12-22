/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseListTypeInfo, CommonFieldConfig, FieldControllerConfig } from '@keystone-6/core/types'

// Common
export type StringOption = { label: string; value: string }
export type NestedOptionsValue = {
  label: string
  subOptions: StringOption[]
}
type Common = {
  options: NestedOptionsValue[]
  defaultIndex?: null | number
  isDynamic: boolean
  filterKey?: null | string
  childLabel?: null | string
  hasSubDisabled?: boolean
  disableDefaultSelection?: boolean
}
export type SelectionType = 'single' | 'multi'

// Backend
export type FieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
  options: Array<NestedOptionsValue>
}

export type NestedSelectConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> &
  Common & {
    isRelationship?: {
      childName?: string
      linkKey?: string
      parentName?: string
    }
    parentType?: SelectionType
    childType?: SelectionType
  }

// frontend
export type Config = FieldControllerConfig<
  Common & {
    parentName: string
    linkKey?: string
    childName: string
    parentType: SelectionType
    childType: SelectionType
  }
>
export type MainOptionsValue = {
  label: string
  value: StringOption[]
}
