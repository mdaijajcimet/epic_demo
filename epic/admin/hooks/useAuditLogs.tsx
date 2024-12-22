import { merge } from 'lodash'
import { useQuery } from '@keystone-6/core/admin-ui/apollo'

import { GET_AUDIT_LOGS } from '../graphql/queries/Common'

const useAuditLogs = (table: string, variables = {} as Record<string, unknown>) => {
  const { take = 20, filters = {} } = variables
  const commonQuery = {
    collectionName: {
      equals: table,
      mode: 'insensitive',
    },
    attributeName: {
      not: {
        equals: 'updatedAt',
      },
    },
  }
  const whereQuery = merge(commonQuery, filters)
  const { data, loading, error, refetch } = useQuery(GET_AUDIT_LOGS, {
    variables: {
      take,
      where: whereQuery,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      fetchPolicy: 'network-only',
    },
  })
  return { data, loading, error, refetch }
}

export default useAuditLogs
