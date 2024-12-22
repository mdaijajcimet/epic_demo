/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty } from 'lodash'
import { useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'

import { GET_RETAILER_FIELDS } from '../graphql/queries/FinancialMatrix'
import { CREATE_RETAILER_MATRIX } from '../graphql/mutations/FinancialMatrix'

const generateOptionsWithId = (arr: Record<string, unknown>[]) => {
  return arr?.map(({ id, name, slug }: any) => {
    return { label: name, value: slug ?? name, id }
  })
}

const filterVerticals = (arr: Record<string, unknown>[]) => {
  const allowedVerticals = ['energy', 'mobile', 'broadband', 'solar']
  return arr?.filter((item: Record<string, any>) => allowedVerticals.includes(item?.slug))
}

const useRetailerFields = (id: string) => {
  const { data, loading, error } = useQuery(GET_RETAILER_FIELDS, {
    variables: { where: { id } },
  })

  const [mutateFn, mutation] = useMutation(CREATE_RETAILER_MATRIX)
  const createRetailerMatrix = (input: Record<string, unknown>) =>
    mutateFn({ variables: { data: { ...input } } })

  let providerName, providerId, verticals, images, plans
  if (!loading && !error && data && !isEmpty(data)) {
    providerId = data?.provider?.id || ''
    providerName = data?.provider?.name || ''
    plans = generateOptionsWithId(data?.provider?.plans || [])
    verticals = generateOptionsWithId(filterVerticals(data?.verticals || []))
    images = generateOptionsWithId(data?.mediaFiles || [])
  }

  return {
    providerName,
    providerId,
    verticals,
    plans,
    images,
    loading,
    error,
    createRetailerMatrix,
    mutation,
  }
}

export default useRetailerFields
