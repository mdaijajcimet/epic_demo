import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'

import type { Hook, HookMap } from '../../../types'

// TODO: update for Validate object
type Data<T extends keyof HookMap> = Parameters<Hook<T, 'validateInput'>>[0]

export const validateSingleRelations = async <T extends keyof HookMap>(
  data: Data<T>,
  fieldKeys: string[],
) => {
  const { resolvedData, operation, addValidationError } = data
  const listKeys = Object.keys(resolvedData)
  if (isEmpty(fieldKeys)) throw new Error('Empty Single Relationship Validator')
  const missingData: string[] = []
  fieldKeys?.forEach((fieldKey) => {
    if (!listKeys.includes(fieldKey)) throw new Error(`Incorrect fieldKey ${fieldKey}`)

    if (operation === 'create' && !resolvedData[fieldKey]) missingData.push(fieldKey)

    if (operation === 'update') {
      if (!isUndefined(resolvedData[fieldKey]) && !resolvedData[fieldKey]?.connect) missingData.push(fieldKey)
    }
  })
  if (missingData.length) addValidationError(`Missing required relationships:\n ${missingData.join('\n')}`)
}

export const validateMultiRelations = async <T extends keyof HookMap>(data: Data<T>, fieldKeys: string[]) => {
  const { resolvedData, operation, addValidationError, context, item, listKey } = data
  const listFields = Object.keys(resolvedData)
  if (isEmpty(fieldKeys)) throw new Error('Empty Multi Relationship Validator')
  const missingData: string[] = []

  const listData =
    operation === 'update'
      ? await context.query[listKey].findOne({
          where: { id: item.id.toString() },
          query: `${fieldKeys.join('{id}')} {id}`,
        })
      : {}

  fieldKeys.forEach((fieldKey) => {
    if (!listFields.includes(fieldKey)) throw new Error(`Incorrect fieldKey ${fieldKey}`)

    if (operation === 'create' && !resolvedData[fieldKey]) missingData.push(fieldKey)

    if (operation === 'update') {
      const fieldData = resolvedData[fieldKey]
      const hasOnlyDisconnections =
        !isUndefined(fieldData) && !isEmpty(fieldData?.disconnect) && isEmpty(fieldData?.connect)

      if (hasOnlyDisconnections) {
        const isAllDataDisconnected = listData[fieldKey]?.length === fieldData.disconnect.length
        if (isAllDataDisconnected) missingData.push(fieldKey)
      }
    }
  })

  if (missingData.length) addValidationError(`Missing required relationships:\n ${missingData.join('\n')}`)
}

export const validateUniqueProvider = async <T extends keyof HookMap>(data: Data<T>) => {
  const { resolvedData, operation, addValidationError, context, listKey } = data
  const { provider } = resolvedData
  if (provider && operation === 'create') {
    const count = await context.query[listKey].count({
      where: { provider: { id: { equals: provider?.connect.id } } },
    })
    if (count) {
      addValidationError('Violating unique constraint: Provider')
    }
  }
}
