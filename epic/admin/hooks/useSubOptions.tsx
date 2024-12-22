/* eslint-disable @typescript-eslint/no-explicit-any */
import { useApolloClient } from '@keystone-6/core/admin-ui/apollo'
import { relationshipConfig } from '../../src/customFields/nestedSelect/config'

export const useSubOptions = () => {
  const client = useApolloClient()

  const getAllSubOptions = async (options: any, parentName: string) => {
    const { query, variables, dataProcessor } = relationshipConfig[parentName]
    const queryPromises = options?.map(async (optionItem: any) => {
      // Perform each query asynchronously
      return client.query({
        query,
        variables: variables(optionItem.value),
      })
    })

    const results = await Promise.all(queryPromises)
    const subOptions = dataProcessor(results)
    const updatedOptions = subOptions?.map((item: any) => ({ label: item.name, value: item.id }))
    return updatedOptions
  }

  return { getAllSubOptions }
}
