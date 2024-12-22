import registerAuditLog from '../../../../registerAuditLog'
import fetchIngestorAPI from '../../../libs/fetchIngestorAPI'
import type { ListHookFuncArgs } from '../../../types'
import { getRelationshipFieldIds } from '../../../utils'

export const commonAfterOp = async (field: string, data: ListHookFuncArgs<'afterOperation'>[0]) => {
  const { operation, item, originalItem, context } = data
  const ids = getRelationshipFieldIds(
    item?.id?.toString() ?? originalItem?.id?.toString(),
    'ignorelist',
    field,
    context,
  )
  await Promise.all([
    fetchIngestorAPI('ingest', {
      operation: operation,
      type: 'ignoredata',
      data: { ids },
    }),
    registerAuditLog(data),
  ])
}
