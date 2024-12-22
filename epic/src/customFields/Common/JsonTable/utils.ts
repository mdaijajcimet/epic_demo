import { isBoolean, isNil, startCase } from 'lodash'
import { JsonTableData, JsonTableEntry, Values } from './typeDefs'

export const getInitialInputs = (fields: JsonTableData) =>
  fields.reduce((acc: Record<string, string | boolean>, field) => {
    const defaultData = {
      checkbox: true,
    }
    if (field.name)
      acc[field.name] = field.defaultValue ?? defaultData[field.element as keyof typeof defaultData] ?? ''
    return acc
  }, {})

export const getLabel = (name: string, label?: string) => label || startCase(name)

export const getTableValue = (
  { element, name, options = [], tableValueFormatter }: JsonTableEntry,
  data: Values,
) => {
  let val = data[name]
  if (element === 'select') val = options.find((opt) => opt.value === val)?.label as string
  if (isNil(val) || val === '') return ''
  if (tableValueFormatter) return tableValueFormatter(val, data)
  if (isBoolean(val)) return val ? 'True' : 'False'
  return val
}
