import { BaseListTypeInfo, CommonFieldConfig, FieldControllerConfig } from '@keystone-6/core/types'

export type TextFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
  isIndexed?: true | 'unique'
  ui?: {
    displayMode?: 'input'
  }
  validation?: {
    /**
     * Makes the field disallow null values and require a string at least 1 character long
     */
    isRequired?: boolean
    match?: { regex: RegExp; explanation?: string }
    length?: { min?: number; max?: number }
  }
  db?: {
    isNullable?: boolean
    map?: string
    extendPrismaSchema?: (field: string) => string
  }
}
export type TextFieldMeta = {
  displayMode: 'input' | 'textarea'
  shouldUseModeInsensitive: boolean
  isNullable: boolean
  validation: {
    isRequired: boolean
    match: { regex: { source: string; flags: string }; explanation: string | null } | null
    length?: { min: number | null; max: number | null }
  }
}

export type Config = FieldControllerConfig<TextFieldMeta>

export type Validation = {
  isRequired: boolean
  match: { regex: RegExp; explanation: string | null } | null
  length: { min: number | null; max: number | null }
}

export type InnerTextValue = { kind: 'null'; prev: string } | { kind: 'value'; value: string }

export type TextValue =
  | { kind: 'create'; inner: InnerTextValue }
  | { kind: 'update'; inner: InnerTextValue; initial: InnerTextValue }
