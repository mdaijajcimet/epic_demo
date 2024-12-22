import { get, isNil, isUndefined, startCase } from 'lodash'
import type { ValidatePercentOpt, ValidateRangeValuesOpt, ValueType } from '../types/schema'
import type { ListHookFuncArgs } from '../types'

export const getSchemaValue = (
  { resolvedData, item }: ListHookFuncArgs<'validateInput'>[0],
  fieldKey: string,
) => {
  // resolvedData will have null when data is removed, undefined when data is not added
  // Make sure this wont take previous stored item when data is removed
  const currVal = get(resolvedData, fieldKey)
  const prevVal = get(item, fieldKey)

  return isUndefined(currVal) ? prevVal : currVal
}

// if the type of value is based on user input then we can pass typeField
export const validatePercent = (
  args: ListHookFuncArgs<'validateInput'>[0],
  fieldKey: string,
  { validateAlways, typeField }: ValidatePercentOpt = {},
) => {
  const { resolvedData, addValidationError } = args
  if (
    !validateAlways &&
    isUndefined(resolvedData[fieldKey]) &&
    (!typeField || isUndefined(resolvedData[typeField]))
  )
    return
  const value = getSchemaValue(args, fieldKey)
  const typeValue = typeField && getSchemaValue(args, typeField)
  if (typeField && typeValue !== 'percent') return
  if (!isNil(value) && (value < 0 || value > 100)) {
    addValidationError(`${startCase(fieldKey)} must be between 0 - 100`)
  }
}

// Mainly used for validating values of min and max range, this also validates value Type
// if the type of value is based on user input then we can pass typeField
export const validateRangeValues = (
  args: ListHookFuncArgs<'validateInput'>[0],
  fieldKey: string,
  maxFieldKey: string,
  { type = 'currency', typeField }: ValidateRangeValuesOpt = {},
) => {
  const { resolvedData, addValidationError } = args
  // If data is not updated in related fields
  if (
    isUndefined(resolvedData[fieldKey]) &&
    isUndefined(resolvedData[maxFieldKey]) &&
    (!typeField || isUndefined(resolvedData[typeField]))
  )
    return

  const value = getSchemaValue(args, fieldKey)
  const maxValue = getSchemaValue(args, maxFieldKey)
  const typeValue: ValueType = typeField ? getSchemaValue(args, typeField) : type
  const fieldLabel = startCase(fieldKey)
  const maxFieldLabel = startCase(maxFieldKey)

  if (isNil(value)) {
    if (!isNil(maxValue)) {
      addValidationError(`${maxFieldLabel} must be empty`)
    }
    return
  }

  if (typeValue === 'percent') {
    validatePercent(args, fieldKey, { validateAlways: true })
  }

  // validate max value and range
  if (!isNil(maxValue)) {
    if (maxValue <= value) {
      addValidationError(`${maxFieldLabel} must be greater than ${fieldLabel}`)
    } else if (typeValue === 'percent') {
      validatePercent(args, maxFieldKey, { validateAlways: true })
    }
  }
}

export const getFormOptionKeyDesc = (key: string) => `Under FormOption "${key}" key must be present`
