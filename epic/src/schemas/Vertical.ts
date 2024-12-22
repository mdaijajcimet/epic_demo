import { list } from '@keystone-6/core'
import { integer, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs, rules } from '../utils/access'
import { selectSchema, slugSchema } from './Common/common'

const journeyTypeOptions = [
  { label: 'Generic', value: 'generic' },
  { label: 'Niche', value: 'niche' },
]

const journeyOptions = [
  { label: 'Lead Funnel Only', value: 'leadOnly' },
  { label: 'End to End', value: 'e2e' },
]

export const Vertical = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      query: (args) => {
        const where = rules.filterVerticalRelatedData(args)
        return where.vertical ?? {}
      },
    },
  },
  fields: {
    serviceId: integer(),
    name: text({ validation: { isRequired: true }, label: 'Vertical name' }),
    slug: slugSchema('title'),
    title: text({ validation: { isRequired: true } }),
    description: text(),
    icon: relationship({ ref: 'Media', many: false }),
    link: relationship({ ref: 'Link', many: false }),
    pages: relationship({ ref: 'Page.vertical', many: true }),
    scripts: relationship({ ref: 'Script.verticals', many: true }),
    journeyType: selectSchema({
      label: 'Configure Journey Type',
      options: journeyTypeOptions,
      defaultValue: 'niche',
    }),
    csJourney: selectSchema({
      label: 'Frontend Journey Config',
      options: journeyOptions,
      defaultValue: 'e2e',
    }),
    agentJourney: selectSchema({
      label: 'Agent Journey Config',
      options: journeyOptions,
      defaultValue: 'e2e',
    }),
  },
  ui: {
    labelField: 'slug',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Vertical),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
