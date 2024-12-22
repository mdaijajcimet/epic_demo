/* eslint-disable @typescript-eslint/no-explicit-any */
import isEmpty from 'lodash/isEmpty'
import type { Context } from '../../../types'
import { map } from 'lodash'

export const connectAllData = async (
  listkey: string,
  fieldKey: string,
  relationListKey: string,
  condition: boolean,
  context: Context,
  id?: {
    toString(): string
  },
) => {
  if (!id) return
  if (condition) {
    const relationshipEntries = await context?.query?.[relationListKey]?.findMany({
      query: 'id',
    })
    if (!isEmpty(relationshipEntries)) {
      await context?.query?.[listkey]?.updateOne({
        where: { id: id?.toString() },
        data: { [fieldKey]: { connect: relationshipEntries } },
      })
    }
  }
}

export const resolveAffiliates = async (data: any) => {
  const { inputData, resolvedData } = data
  const addedAffiliates = inputData?.affiliate?.connect
  const removedAffiliates = inputData?.affiliate?.disconnect
  if (addedAffiliates || removedAffiliates) {
    resolvedData.hasAllAffiliates = false
  }
  return resolvedData
}

export const addAffiliates = async (data: any) => {
  const { item, originalItem, context, listKey, inputData } = data
  const id = item?.id ?? originalItem?.id
  if (item?.hasAllAffiliates || inputData?.isDefault) {
    const affiliates = await context?.query?.Affiliate.findMany({ query: 'id' })
    if (!isEmpty(affiliates)) {
      await context?.query?.[listKey].updateOne({
        where: { id: id?.toString() },
        data: { affiliate: { connect: affiliates } },
      })
    }
  }
}

export const addSubAffiliates = async (data: any) => {
  const { item, originalItem, context, listKey, inputData } = data
  const id = item?.id ?? originalItem?.id
  const includeSubAff = inputData?.includeAllSubAff || item?.includeAllSubAff
  if (includeSubAff) {
    const addedAffiliates = map(inputData?.affiliate?.connect || [], 'id')
    if (isEmpty(addedAffiliates)) return
    const affiliates = await context?.query?.Affiliate.findMany({
      where: {
        id: { in: addedAffiliates },
      },
      query: 'id subAffiliates { id }',
    })
    if (!isEmpty(affiliates)) {
      const subAffiliates = affiliates?.map((affiliate: any) => affiliate?.subAffiliates)?.flat(1)
      if (!isEmpty(subAffiliates)) {
        await context?.query?.[listKey].updateOne({
          where: { id: id?.toString() },
          data: { subAffiliate: { connect: subAffiliates } },
        })
      }
    }
  }
}

export const commonCardUI = ({
  displayMode = 'cards',
  inlineConnect = false,
  inlineFields = [],
  cardFields = ['label'],
  linkToItem = true,
  hideRemove = true,
}: any) => {
  return {
    displayMode,
    cardFields,
    linkToItem,
    inlineConnect,
    inlineCreate: { fields: inlineFields },
    inlineEdit: { fields: inlineFields },
    removeMode: hideRemove ? 'none' : 'disconnect',
  } as any
}
