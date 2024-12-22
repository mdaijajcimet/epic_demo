import { intersectionBy, isEmpty } from 'lodash'
import type { ListHookFuncArgs } from '../../types'
import { connectAllData } from '../Common/utils/common'

type RelItem = Record<string, unknown>

const hasIntersection = (arr1: Array<RelItem>, arr2: Array<RelItem>, fieldKey = 'id') =>
  intersectionBy(arr1, arr2, fieldKey).length

export const allowDisAllowOverlap = ({
  resolvedData,
  addValidationError,
}: ListHookFuncArgs<'validateInput'>[0]) => {
  const affiliateError = `An Affiliate/SubAffiliate can't be present in both allow and disallow`

  const { disallowSubaff, disallowAff, affiliates, subAffiliates } = resolvedData
  if (
    hasIntersection(disallowAff?.connect, affiliates?.connect) ||
    hasIntersection(disallowSubaff?.connect, subAffiliates?.connect)
  )
    addValidationError(affiliateError)
  // TODO add test for existing cases
}

export const connectAffAndSubAff = async (listKey: string, data: ListHookFuncArgs<'afterOperation'>[0]) => {
  const { operation, context, item, originalItem } = data
  const id = item?.id ?? originalItem?.id

  if (operation !== 'delete') {
    connectAllData(
      listKey,
      'affiliates',
      'Affiliate',
      !!item?.hasAllAffiliates && !originalItem?.hasAllAffiliates,
      context,
      id,
    )

    if (
      item?.hasAllSubaffiliates &&
      (!originalItem?.hasAllSubaffiliates || !originalItem?.hasAllAffiliates)
    ) {
      const response: Record<string, any> = item?.hasAllAffiliates
        ? await context.query.SubAffiliate.findMany({ query: 'id' })
        : await context.query?.[listKey]?.findOne({
            where: {
              id: id?.toString(),
            },
            query: 'affiliates { subAffiliates {id } }',
          })

      type Ids = { id: string }[]
      const data = item?.hasAllAffiliates
        ? response
        : response?.affiliates?.reduce?.(
            (acc: Ids, aff?: { subAffiliates: Ids }) => [...acc, ...(aff?.subAffiliates ?? [])],
            [],
          )

      if (!isEmpty(data)) {
        await context?.query?.[listKey]?.updateOne({
          where: { id: id?.toString() },
          data: { subAffiliates: { connect: data } },
        })
      }
    }
  }
}
