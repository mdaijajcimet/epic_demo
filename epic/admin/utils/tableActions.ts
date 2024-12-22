import { LIST_GROUPS } from '../../src/constants/access'
import type { ListKey } from '../../src/types'
import { COMMON_ACTION_MODULES } from '../constants/tableActions'
import type { ActionGroupKey } from '../types/tableActions'

export const getActionTables = (actionGroupKey: ActionGroupKey) =>
  actionGroupKey === 'default'
    ? COMMON_ACTION_MODULES.reduce(
        (acc, module) => [...acc, ...(LIST_GROUPS?.[module] || [])],
        [] as ListKey[],
      )
    : LIST_GROUPS[actionGroupKey]
