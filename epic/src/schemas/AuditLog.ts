import { list } from '@keystone-6/core'
import { text, timestamp } from '@keystone-6/core/fields'
import keys from 'lodash/keys'
import values from 'lodash/values'

import { ACCESS_MODULE_MAP, LIST_ACCESS_KEY_MAP } from '../config/access'
import type { AccessModules } from '../types/access'
import { getModuleUIArgs, hasModulePermission, isAccessAllowed, isSuperUser } from '../utils/access'

const AuditLog = list({
  access: {
    operation: {
      query: hasModulePermission.read,
      create: () => true,
      update: () => false,
      delete: () => false,
    },
    filter: {
      query: (args) => {
        if (isSuperUser(args)) return {}
        const allModules = values(values(ACCESS_MODULE_MAP))
          .map((group) => values(group.modules))
          .flat(1)
        const modulesWithPermission = allModules.reduce(
          (acc, module) => (isAccessAllowed('read', args, module) ? [...acc, module] : acc),
          [] as AccessModules[],
        )

        const lists = keys(LIST_ACCESS_KEY_MAP).filter((list) => {
          const input = LIST_ACCESS_KEY_MAP[list as keyof typeof LIST_ACCESS_KEY_MAP]

          if (typeof input === 'string') return modulesWithPermission.includes(input) ? true : false
          if (input.AND?.length) return input.AND.every((mod) => modulesWithPermission.includes(mod))
          if (input.OR?.length) return input.OR.some((mod) => modulesWithPermission.includes(mod))
          return false
        })

        return { collectionName: { in: lists } }
      },
    },
  },
  fields: {
    userId: text(),
    username: text(),
    collectionName: text(),
    docId: text(),
    attributeName: text(),
    actionType: text(),
    oldValue: text(),
    newValue: text(),
    createdAt: timestamp({ defaultValue: { kind: 'now' }, db: { updatedAt: true } }),
  },
  ui: {
    listView: {
      defaultFieldMode: 'read',
      initialColumns: ['collectionName', 'docId', 'attributeName', 'actionType', 'createdAt', 'username'],
      initialSort: {
        field: 'createdAt',
        direction: 'DESC',
      },
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.AuditLog, {
      hideCreate: true,
      hideDelete: true,
      fieldMode: 'hidden',
      itemFieldMode: 'read',
    }),
  },
})

export default AuditLog
