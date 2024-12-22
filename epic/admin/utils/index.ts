/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldMeta, ListMeta } from '@keystone-6/core/types'
import { keys as _keys, compact, get, isObject, isPlainObject, last, sortBy, uniq } from 'lodash'
import { PrimitiveField, RelField } from '../../src/types'
import { mappedTables } from '../constants/config'
export const getValue = (obj: any): any => {
  if (!isObject(obj)) {
    return obj
  }
  const keys = _keys(obj)
  if (keys.length === 0) {
    return obj
  }
  const lastKey = last(keys) as string
  const lastValue = get(obj, lastKey)
  return getValue(lastValue)
}

export const generateOptions = (arr: any[]) =>
  arr.map((val) => {
    return { label: val, value: val }
  })

export const getFieldData = (fields: { [path: string]: FieldMeta }) => {
  const { primitiveFields, relationshipFields } = Object.entries(fields).reduce(
    (
      acc: { primitiveFields: Record<string, PrimitiveField>; relationshipFields: Record<string, RelField> },
      [key, value],
    ) => {
      const { fieldMeta = {} } = value
      if (fieldMeta && typeof fieldMeta === 'object' && 'refListKey' in fieldMeta && fieldMeta.refListKey) {
        acc.relationshipFields[key] = {
          refListKey: fieldMeta.refListKey,
          many: Boolean(fieldMeta.many),
          refFieldKey: fieldMeta.refFieldKey,
          refLabelField: typeof fieldMeta.refLabelField === 'string' ? fieldMeta.refLabelField : '',
        }
      } else if (key && key !== 'id')
        acc.primitiveFields[key] = {
          validation:
            fieldMeta && typeof fieldMeta === 'object' && 'validation' in fieldMeta
              ? fieldMeta?.validation
              : {},
        }

      return acc
    },
    { primitiveFields: {}, relationshipFields: {} },
  )
  return {
    primitiveFields,
    relationshipFields,
  }
}

export const extractMappedTables = (tables: { label: string; value: string }[], mappedTables: string[]) => {
  return tables.filter((item) => mappedTables.includes(item.label))
}

export const getTableNames = (lists: string[]) => sortBy(generateOptions(lists), ['label'])

export const getFilterData = async ({
  query,
  variables,
  type,
}: {
  query: string
  variables: any
  type: string
}) => {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: variables(),
    }),
  })
  const { data } = await res.json()
  const result: any[] = uniq(compact(get(data, `${type}`, []).map((item: any) => getValue(item)))) || []
  return generateOptions(result)
}
export const getStringValue = (
  item: Record<string, any>,
  key: string,
  foreignFields: Record<string, string>,
): string => {
  const value = item?.[key]
  if (isPlainObject(value)) {
    if (key in foreignFields) {
      const ref = foreignFields[key]
      return ref ? value[ref] : JSON.stringify(value)
    }
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value.map((subItem) => getStringValue({ [key]: subItem }, key, foreignFields)))
  }
  return value
}

export const getConnectedLists = (lists: Record<string, ListMeta>, list: ListMeta) => {
  return Object.values(lists).reduce(
    (acc: Record<string, ListMeta>, currList) =>
      Object.values(currList.fields).find(
        (currField) =>
          typeof currField.fieldMeta === 'object' &&
          currField.fieldMeta !== null &&
          'refListKey' in currField.fieldMeta &&
          currField.fieldMeta?.refListKey &&
          currField.fieldMeta.refListKey === list.key,
      )
        ? { ...acc, [currList.key]: currList }
        : acc,
    {},
  )
}

export const sanitizeDataForCopy = (
  data: Array<Record<string, any>>,
  list: ListMeta,
  connectedLists: Record<string, ListMeta>,
) => {
  const fields = list.fields
  const keys = Object.keys(fields)
  return data.map((item) => {
    const updatedItem: Record<string, any> = {}
    const uniqueId = new Date().toISOString()

    keys.forEach((key) => {
      if (key === 'id') return
      const fieldMeta = fields[key]?.fieldMeta

      if (fieldMeta && typeof fieldMeta === 'object' && 'refListKey' in fieldMeta) {
        // skip if two sided relationship + unique on rlationship table
        const isRelUnique = () =>
          Object.values(connectedLists[fieldMeta.refListKey as string]?.fields ?? {}).find(
            (currField) =>
              currField.fieldMeta &&
              typeof currField.fieldMeta === 'object' &&
              'refListKey' in currField.fieldMeta &&
              currField.fieldMeta.refListKey === list.key &&
              currField.fieldMeta.refFieldKey === key &&
              !currField.fieldMeta.many,
          )

        if (fieldMeta?.many) {
          const ids = item[key]?.reduce(
            (acc: { id: string }[], sub: any) => (sub.id ? [...acc, { id: sub.id }] : acc),
            [],
          )
          if (ids.length && !isRelUnique())
            updatedItem[key] = {
              connect: ids,
            }
        } else if (item[key]?.id && !isRelUnique()) updatedItem[key] = { connect: { id: item[key]?.id } }
      } else {
        updatedItem[key] =
          key === list.labelField || mappedTables[list.key]?.filterKeys?.includes(key)
            ? item[key] + ' - Copy' + uniqueId
            : item[key]
      }
    })
    return updatedItem
  })
}
