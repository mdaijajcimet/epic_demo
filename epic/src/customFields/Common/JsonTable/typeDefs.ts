import { Options } from '../../../types'
import { JsonFieldProps } from '../../typeDefs'

export type Value = string | boolean
export type Values = Record<string, Value>
export type ListValues = Values[]

export type JsonTableElement = 'input' | 'checkbox' | 'select'
export type JsonTableEntry = {
  name: string
  element?: JsonTableElement
  label?: string
  type?: 'number' | 'search' | 'text' | 'email' | 'password' | 'tel' | 'url'
  defaultValue?: Value
  options?: Options
  getOptions?: () => Promise<Options>
  description?: string
  isRequired?: boolean | { message: string }
  tableHeader?: string
  tableValueFormatter?: (val: Value, values: Values) => Value
}
export type JsonTableData = JsonTableEntry[]

export type JsonTableProps = JsonFieldProps & {
  fields: JsonTableData
}
