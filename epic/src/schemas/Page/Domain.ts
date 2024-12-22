import { list } from '@keystone-6/core'
import { relationship, select, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { SEO_PERMISSION } from './constants'
import { getDomainRule } from './utils'

export const Domain = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      query: getDomainRule,
    },
  },
  fields: {
    name: text(),
    description: text(),
    hostname: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    generateSEO: select({
      options: Object.values(SEO_PERMISSION),
      defaultValue: SEO_PERMISSION.allowed.value,
      label: 'Generate SEO Content',
      ui: {
        displayMode: 'segmented-control',
        description: 'Do you want to create sitemap.xml and robots.txt for this domain?',
        itemView: { fieldPosition: 'sidebar' },
      },
    }),
    pages: relationship({ ref: 'Page.domain', many: true }),
    redirects: relationship({ ref: 'Redirect.domain', many: true }),
    domainConfig: relationship({
      ref: 'DomainConfig.domains',
      ui: { itemView: { fieldPosition: 'sidebar' } },
    }),
    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    labelField: 'hostname',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Domain),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
