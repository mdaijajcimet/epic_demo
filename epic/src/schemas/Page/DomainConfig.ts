import { group, list } from '@keystone-6/core'
import { checkbox, json, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { coloursSchema } from './common'
import { getDomainRule } from './utils'

export const DomainConfig = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      query: (args) => ({ domains: { some: getDomainRule(args) } }),
    },
  },
  fields: {
    ...group({
      label: 'Essentials',
      fields: {
        title: text({ validation: { isRequired: true } }),
        domains: relationship({ ref: 'Domain.domainConfig', many: true }),
      },
    }),
    ...group({
      label: 'Meta',
      fields: {
        metaTitle: text(),
        metaDescription: text(),
        favicon: relationship({ ref: 'Media' }),
      },
    }),
    ...group({
      ...coloursSchema(),
    }),
    ...group({
      label: 'Font',
      fields: {
        fontUrl: text(),
        fontFamily: text(),
      },
    }),
    ...group({
      label: 'Header',
      fields: {
        headerLogo: relationship({ ref: 'Media' }),
        headerLinkGroups: relationship({ ref: 'LinkGroup', many: true }),
        headerLinkGroupsOrder: json({ defaultValue: [] }),
        enableBlogs: checkbox({ defaultValue: false, label: 'Enable blogs' }),
      },
    }),
    ...group({
      label: 'Footer',
      fields: {
        footerLogo: relationship({ ref: 'Media' }),
        footerLinkGroups: relationship({ ref: 'LinkGroup', many: true }),
        footerLinkGroupsOrder: json({ defaultValue: [] }),
        socialIcons: relationship({ ref: 'Link', many: true }),
        address: text(),
        disclaimer: text(),
      },
    }),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.DomainConfig),
  },
})
