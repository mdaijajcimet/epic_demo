import { group, list } from '@keystone-6/core'
import { integer, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs, isSuperUser } from '../../utils/access'
import { coloursSchema } from './common'
import { getCommonPageRules } from './utils'

export const PageConfig = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      query: (args) => {
        if (isSuperUser(args)) return {}
        return { OR: [{ page: getCommonPageRules(args) }, { page: null }] }
      },
    },
  },
  fields: {
    ...group({
      label: 'Essentials',
      fields: {
        title: text({ validation: { isRequired: true } }),

        rcCode: text(),
        ivrNumber: integer(),
        page: relationship({
          ref: 'Page.pageConfig',
          ui: {
            labelField: 'title',
          },
        }),
      },
    }),

    ...group({
      label: 'Media',
      fields: {
        favicon: relationship({
          ref: 'Media',
          ui: {
            labelField: 'title',
          },
        }),
        headerLogo: relationship({
          ref: 'Media',
          ui: {
            labelField: 'title',
          },
        }),
      },
    }),

    ...group({
      ...coloursSchema(),
    }),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PageConfig),
  },
})
