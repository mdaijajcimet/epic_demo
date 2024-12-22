import { BaseListTypeInfo, CommonFieldConfig, FieldData } from '@keystone-6/core/types'
import capitalize from 'lodash/capitalize'

export function assertReadIsNonNullAllowed<ListTypeInfo extends BaseListTypeInfo>(
  meta: FieldData,
  config: CommonFieldConfig<ListTypeInfo>,
  resolvedIsNullable: boolean,
) {
  if (!resolvedIsNullable) return
  if (!config.graphql?.isNonNull?.read) return

  throw new Error(
    `The field at ${meta.listKey}.${meta.fieldKey} sets graphql.isNonNull.read: true, but not validation.isRequired: true, or db.isNullable: false\n` +
      `Set validation.isRequired: true, or db.isNullable: false, or graphql.isNonNull.read: false`,
  )
}

/**
 * Turns a passed in string into
 * a human readable label
 * @param {String} str The string to convert.
 * @returns The new string
 */
export const humanize = (str: string) => {
  return (
    str
      .replace(/([a-z])([A-Z]+)/g, '$1 $2')
      // eslint-disable-next-line no-useless-escape
      .split(/\s|_|\-/)
      .filter(Boolean)
      .map(capitalize)
      .join(' ')
  )
}
