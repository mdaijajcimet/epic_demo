import { graphql, list } from '@keystone-6/core'
import { json, relationship, select, text, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

import { validateMultiRelations } from '../Common/utils/relationshipValidators'

export const Tag = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    pages: relationship({ ref: 'Page.tags', many: true }),
  },
  hooks: {
    afterOperation: async (args) => registerAuditLog(args),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Tag),
  },
})

export const Link = list({
  access: ModuleOpAccessArgs,
  fields: {
    key: text(),
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, unknown>) {
          return `${item?.label} - ${item?.url}`
        },
      }),
    }),
    label: text({ validation: { isRequired: true } }),
    url: text({ validation: { isRequired: true } }),
    icon: relationship({ ref: 'Media', ui: { labelField: 'title' } }),
    type: select({
      options: [
        { label: 'External Link', value: 'externalLink' },
        { label: 'Internal Link', value: 'internalLink' },
      ],
    }),
  },
  ui: {
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Link),
  },
  hooks: { afterOperation: async (args) => registerAuditLog(args) },
})

export const LinkGroup = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: text({ validation: { isRequired: true } }),
    key: text({ validation: { isRequired: true } }),
    links: relationship({ ref: 'Link', many: true }),
    linksOrder: json({ defaultValue: [] }),
  },
  ui: {
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.LinkGroup),
  },
  hooks: {
    validate: async (args) => {
      if (args.operation === 'delete') return
      validateMultiRelations<'list'>(args, ['links'])
    },
    afterOperation: async (args) => registerAuditLog(args),
  },
})
