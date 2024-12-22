import type { PageWhereInput } from '.keystone/types'

import type { Session } from '../../../types'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import type { ListHookFuncArgs, ListUI } from '../../types'
import type { AccessArgs } from '../../types/access'
import { Mutable } from '../../types/utils'
import { getFieldIds } from '../../utils'
import { hasModulePermission, isSuperUser, rules } from '../../utils/access'
import { PUBLICATION_STATUS } from './constants'

// returns true if any of the given roles is present
export const hasPagePermission = (args: AccessArgs, roles: Array<'editor' | 'publisher'>) =>
  // TODO: uncomment after testing phase
  // process.env.NODE_ENV !== 'production' ||
  !!roles.find((role) => {
    if (role === 'editor') return hasModulePermission.write(args, LIST_ACCESS_KEY_MAP.Page)
    if (role === 'publisher') return hasModulePermission.publish(args, LIST_ACCESS_KEY_MAP.Page)
  })

type Params = ListHookFuncArgs<'resolveInput'>[0]
/**
 * [ENVIRONMENT: production]
 *
 * On update, for editors, the Page will be put to review if it is currently published
 *
 * Only PUBLISHER, can publish/delete pages (see: USER - additional roles)
 *  */
export const getApproval = ({
  resolvedData,
  context,
  operation,
  item,
  listKey,
}: Params): Record<string, unknown> => {
  const args = { context, session: context.session, listKey }

  // if Editor tries to PUBLISH/DELETE
  const hasPublisherAccess = hasPagePermission(args, ['publisher'])

  if (
    !hasPublisherAccess &&
    [PUBLICATION_STATUS.published.value, PUBLICATION_STATUS.deleted.value].includes(resolvedData.status)
  ) {
    return { error: `[Permission Denied]: You don't have access` }
  }

  // when existing status is PUBLISHED
  if (
    !hasPublisherAccess &&
    operation === 'update' &&
    !resolvedData.status &&
    item.status === PUBLICATION_STATUS.published.value
  )
    resolvedData.status = 'review'

  return resolvedData
}

export const pageModuleAccess = {
  create: (args: AccessArgs) => hasPagePermission(args, ['publisher', 'editor']),
  update: (args: AccessArgs) => hasPagePermission(args, ['publisher', 'editor']),
  query: hasModulePermission.read,
  delete: (args: AccessArgs) => hasPagePermission(args, ['publisher']),
}

export const getDomainRule = (args: AccessArgs) =>
  isSuperUser(args) ? {} : { id: { in: getFieldIds((args.session as Session).data.assignedDomains) } }

export const getCommonPageRules = (args: AccessArgs) => {
  if (isSuperUser(args)) return {}
  const domainRule = getDomainRule(args)
  const verticalRule = rules.filterVerticalRelatedData(args)
  const pageAND: Mutable<PageWhereInput['AND']> = []
  if (!hasPagePermission(args, ['publisher'])) {
    pageAND.push({ status: { notIn: [PUBLICATION_STATUS.deleted.value] } })
  }
  if ('id' in domainRule) pageAND.push({ domain: domainRule })
  pageAND.push(verticalRule)
  return { AND: pageAND }
}

export const getDefaultPageView = (
  type: 'page' | 'pageElement' = 'page',
  // for page elements, we can hide on Soft Deleted Page if needed
  options: { pageElement?: { considerSoftDelete: boolean } } = {},
): Pick<ListUI, 'itemView' | 'hideCreate' | 'hideDelete'> => {
  return {
    hideCreate(args) {
      return !hasPagePermission(args, ['publisher', 'editor'])
    },
    hideDelete(args) {
      return !hasPagePermission(args, ['publisher'])
    },
    itemView: {
      async defaultFieldMode({ item, context, session }) {
        const isPublisher = hasPagePermission({ session, context }, ['publisher'])
        const isEditor = hasPagePermission({ session, context }, ['editor'])
        let status = item?.status

        // get status of linked page
        if (type === 'pageElement' && options.pageElement?.considerSoftDelete) {
          const pageId = item?.pagesId?.toString?.()
          if (pageId) {
            const page = await context.query.Page.findOne({
              where: {
                id: pageId,
              },
              query: 'status',
            })
            status = page?.status
          }
        }

        // find field mode
        if (status === PUBLICATION_STATUS.deleted.value) return isPublisher ? 'read' : 'hidden'
        return isPublisher || isEditor ? 'edit' : 'read'
      },
    },
  }
}
