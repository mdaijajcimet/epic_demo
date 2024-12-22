import type { Session } from '../../../types'
import type { AccessArgs } from '../../types/access'
import { isAccessAllowed, isSuperUser } from './common'
import { getAllowedVerticals } from './vertical'

/*
  Rules are logical functions that can be used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items
*/
export const rules = {
  canReadRoles: (args: AccessArgs) => {
    return (
      isAccessAllowed('read', args) || {
        id: { in: (args.session as Session)?.data.roles?.map((role) => role.id) },
      }
    )
  },
  canReadPeople: (args: AccessArgs) =>
    isAccessAllowed('read', args) || { id: { equals: (args.session as Session)?.data?.id } },
  canUpdatePeople: (args: AccessArgs) =>
    isAccessAllowed('write', args) || { id: { equals: (args.session as Session)?.data?.id } },
  canDeletePeople: (args: AccessArgs) =>
    isAccessAllowed('delete', args) || { id: { equals: (args.session as Session)?.data?.id } },
  filterVerticalRelatedData: (args: AccessArgs) => {
    if (isSuperUser(args)) return {}
    const allowedVerticals = getAllowedVerticals(args)
    return {
      vertical: {
        slug: {
          in: allowedVerticals,
        },
      },
    }
  },
}
