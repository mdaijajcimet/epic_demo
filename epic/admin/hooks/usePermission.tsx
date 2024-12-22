import { useQuery } from '@keystone-6/core/admin-ui/apollo'
import { useKeystone } from '@keystone-6/core/admin-ui/context'
import isEmpty from 'lodash/isEmpty'

import { LIST_ACCESS_KEY_MAP } from '../../src/config/access'
import type { AccessModuleInput, AllPermissionsVal } from '../../src/types/access'
import { isAccessAllowed } from '../../src/utils/access'
import { Session } from '../../types'
import { GET_SESSION } from '../graphql/queries/access'

type UsePermissionProps = {
  listKey?: keyof typeof LIST_ACCESS_KEY_MAP
  permissionType: AllPermissionsVal
  accessModuleInput?: AccessModuleInput
}

export const usePermission = () => {
  const { authenticatedItem } = useKeystone()

  const {
    data: { user } = {},
    loading,
    error,
  } = useQuery(GET_SESSION, {
    skip: authenticatedItem.state !== 'authenticated' || !authenticatedItem.id,
    variables: {
      where: {
        id: authenticatedItem.state === 'authenticated' ? authenticatedItem.id : '',
      },
    },
  })

  const userData = user as Session['data']

  const hasAccess = ({ listKey, permissionType, accessModuleInput }: UsePermissionProps) => {
    if (loading || error || ['loading', 'error'].includes(authenticatedItem.state)) return null
    if (authenticatedItem.state === 'unauthenticated' || isEmpty(userData) || !userData?.roles?.length)
      return false

    return isAccessAllowed(permissionType, { session: { data: userData }, listKey }, accessModuleInput)
  }

  return {
    hasAccess,
    loading: loading || authenticatedItem.state === 'loading',
    error: error || authenticatedItem.state === 'error' ? error?.message || 'An Error Occurred' : null,
  }
}
