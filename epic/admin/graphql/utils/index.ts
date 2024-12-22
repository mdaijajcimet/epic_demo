import { FieldMeta, ListMeta } from '@keystone-6/core/types'

import { copyOrderKeys } from '../../components/Copy/config'
import { PAGE_SIZE } from '../constants'

export const getQueryVariables = (
  listKey: string,
  page: number,
  where: Record<string, unknown> = {},
  orderBy: Array<Record<string, 'asc' | 'desc'>> = [],
) => ({
  limit: PAGE_SIZE,
  offset: (page - 1) * PAGE_SIZE,
  where,
  orderBy: orderBy.length
    ? orderBy
    : [
        {
          [copyOrderKeys[listKey]]: 'asc',
        },
      ],
})

type QueryType = 'create' | 'query' | 'delete'
export const getQueryHeader = (
  list: ListMeta & { listQueryName: string },
  queryType: QueryType = 'query',
) => {
  const { listQueryName, gqlNames } = list
  switch (queryType) {
    case 'query':
      return `query ${listQueryName}($orderBy: [${gqlNames.listOrderName}!]!, $where: ${gqlNames.whereInputName}!, $limit: Int, $offset: Int) {
      ${gqlNames.listQueryName}(orderBy: $orderBy, where: $where, take: $limit, skip: $offset) {
  `
    case 'create':
      return `mutation Create${listQueryName}($data: [${gqlNames.createInputName}!]!) {
      ${gqlNames.createManyMutationName}(data: $data) {
    `
    case 'delete':
      return `mutation Delete${listQueryName}($where: [${gqlNames.whereUniqueInputName}!]!) {
      ${gqlNames.deleteManyMutationName}(where: $where) {
    `
  }
}

export const getQueryFields = (fields: Record<string, FieldMeta>, queryType: QueryType = 'query') => {
  switch (queryType) {
    case 'create':
    case 'query':
      return Object.keys(fields).reduce((acc, field) => {
        const fieldMeta = fields[field]?.fieldMeta
        if (
          typeof fieldMeta === 'object' &&
          fieldMeta !== null &&
          'refListKey' in fieldMeta &&
          fieldMeta?.refListKey
        )
          return `${acc} \n ${field} { \n id \n ${fieldMeta?.refLabelField ?? ''} \n } `
        else return `${acc} \n ${field}`
      }, '')
    case 'delete':
      return `\n id`
  }
}
export const getQuery = (list: ListMeta & { listQueryName: string }, queryType: QueryType = 'query') => {
  const fields = list?.fields || []

  const queryHeader = getQueryHeader(list, queryType)

  const queryFields = getQueryFields(fields, queryType)

  return `${queryHeader} ${queryFields} \n} \n}`
}

export const constructSearchData = (searchVal: string, fields: Record<string, FieldMeta>) => {
  const trimmedSearch = searchVal.trim()
  const fieldKeys = Object.keys(fields)
  const isValidId = trimmedSearch.length > 0
  type Where = {
    OR: Array<Record<string, any> | null>
  }
  const whereData: Where = {
    OR: [...fieldKeys]
      .map((field) =>
        fields[field].search
          ? {
              [field]: {
                contains: searchVal,
                mode: fields[field].search,
              },
            }
          : null,
      )
      .filter((item) => item),
  }
  if (isValidId) {
    whereData.OR.push({
      id: {
        equals: trimmedSearch,
      },
    })
  }
  return whereData
}
