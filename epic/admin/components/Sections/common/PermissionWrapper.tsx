/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useKeystone } from '@keystone-6/core/admin-ui/context'
import { useRouter } from '@keystone-6/core/admin-ui/router'
import { LoadingDots } from '@keystone-ui/loading'
import size from 'lodash/size'
import React, { useEffect, useState } from 'react'

import type { ListKey } from '../../../../src/types'
import { Option } from '../../../../src/types'
import type { AllPermissionsVal } from '../../../../src/types/access'
import { usePermission } from '../../../hooks/usePermission'
import { getTableNames } from '../../../utils'

type PermissionWrapperProps = {
  children: React.ReactNode
  permissionType?: AllPermissionsVal
  mappedTables: Partial<Record<ListKey, any>> | ListKey[]
  actionTables?: ListKey[]
  options?: {
    setTables?: React.Dispatch<React.SetStateAction<Option[] | null>>
    setSelectedTable?: React.Dispatch<React.SetStateAction<Option | null>>
    shouldRedirect?: boolean
    showNoAccessMsg?: boolean
  }
}

export const PermissionWrapper = ({
  mappedTables,
  children,
  permissionType = 'write',
  options: { shouldRedirect = false, showNoAccessMsg = true, ...options } = {},
  actionTables,
}: PermissionWrapperProps) => {
  const router = useRouter()

  const { visibleLists } = useKeystone()

  const { loading, error, hasAccess } = usePermission()
  const [isAllowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    if (visibleLists.state === 'loaded' && !error && !loading && mappedTables && size(mappedTables)) {
      const mappedTableKeys = Array.isArray(mappedTables)
        ? mappedTables
        : (Object.keys(mappedTables) as ListKey[])

      const allowedTables = mappedTableKeys.filter(
        (table) =>
          (!actionTables || actionTables.includes(table)) &&
          [...visibleLists.lists].includes(table) &&
          hasAccess({ listKey: table, permissionType: permissionType }),
      )

      if (!allowedTables.length) {
        if (shouldRedirect) router.push('/')
        else setAllowed(false)
      } else setAllowed(true)

      const tableOptions = getTableNames(allowedTables)

      options.setTables?.(tableOptions)
      options.setSelectedTable?.(tableOptions[0])
    } else options.setTables?.([])
  }, [visibleLists.state, loading, error])

  if (loading) return <LoadingDots label="loading" size="medium" tone="active" />
  if (error) return <p>{error}</p>
  if (!isAllowed) return !shouldRedirect && showNoAccessMsg ? 'No Access!' : null
  return children
}
