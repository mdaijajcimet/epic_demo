import { useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'

import { GET_PROVIDER } from '../graphql/queries/Common'
import { RETAILER_MATRIX } from '../graphql/queries/FinancialMatrix'
import { DELETE_RETAILER_MATRIX } from '../graphql/mutations/FinancialMatrix'
import { processFilterData } from '../utils/financialMatrix'

const useRetailerData = (id: string, filterData = {} as Record<string, unknown>) => {
  const { data: providerData } = useQuery(GET_PROVIDER, {
    variables: { where: { id } },
  })
  const updatedFilters = processFilterData(filterData)
  const { data, loading, error, refetch } = useQuery(RETAILER_MATRIX, {
    variables: {
      take: 1000,
      where: {
        retailer: {
          id: {
            equals: id,
          },
        },
        ...updatedFilters,
      },
    },
    fetchPolicy: 'cache-and-network',
  })

  const providerName = providerData?.provider?.name || ''

  const [mutateFn] = useMutation(DELETE_RETAILER_MATRIX)
  const deleteRetailerMatrix = (input: Record<string, unknown>) =>
    mutateFn({ variables: { where: { ...input } } })

  return { providerName, data, loading, error, deleteRetailerMatrix, refetch }
}

export default useRetailerData
