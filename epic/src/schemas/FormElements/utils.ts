import isEmpty from 'lodash/isEmpty'
import concat from 'lodash/concat'
import { KeystoneContext, BaseKeystoneTypeInfo } from '@keystone-6/core/types'

import { getRelationshipFieldIds } from '../../utils'

export const getContainerIdsFromComponent = async (
  id: string | string[] | undefined,
  context: KeystoneContext<BaseKeystoneTypeInfo>,
  limit = 0,
) => {
  let ids: string[] = []

  // Fallback if by mistake someone adds the component <-> field recursively
  if (limit > 10) return ids

  // Case 1: Get Ids connected to Form Container directly
  const mainContainerIds = await getRelationshipFieldIds(id, 'formContainer', 'formComponents', context)
  if (!isEmpty(mainContainerIds)) {
    ids = concat(ids, mainContainerIds)
  }

  // Case 2: Get Field Ids which are linked to Subcomponents
  const fieldIds = await getRelationshipFieldIds(id, 'formField', 'subComponents', context)
  if (isEmpty(fieldIds)) return ids

  const fieldContainerIds = await getContainerIdsFromField(fieldIds, context, limit + 1)
  if (!isEmpty(fieldContainerIds)) ids = concat(ids, fieldContainerIds)

  return ids
}

export const getContainerIdsFromField = async (
  id: string | string[] | undefined,
  context: KeystoneContext<BaseKeystoneTypeInfo>,
  limit = 0,
) => {
  let ids: string[] = []
  const componentIds = await getRelationshipFieldIds(id, 'formComponent', 'fields', context)
  if (isEmpty(componentIds)) return ids
  ids = await getContainerIdsFromComponent(componentIds, context, limit + 1)
  return ids
}
