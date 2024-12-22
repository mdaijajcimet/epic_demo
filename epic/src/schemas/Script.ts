import { list } from '@keystone-6/core'
import { checkbox, integer, multiselect, relationship, select, text } from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import path from 'path'

import registerAuditLog from '../../registerAuditLog'
import { componentBlocks } from '../componentBlocks'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { newScriptRelatedVerticals, oldScriptRelatedVerticals } from '../constants/verticals'
import { ModuleOpAccessArgs, getAllowedVerticals, getModuleUIArgs, isSuperUser } from '../utils/access'
import { slugSchema } from './Common/common'

export const Script = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      query: (args) => ({
        verticals: isSuperUser(args) ? {} : { some: { slug: { in: getAllowedVerticals(args) } } },
      }),
    },
  },
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: slugSchema('title'),
    verticals: relationship({
      ref: 'Vertical.scripts',
      many: true,
    }),
    showOnBundle: checkbox({
      defaultValue: true,
      ui: {
        itemView: { fieldPosition: 'sidebar' },
      },
    }),
    component: relationship({
      ref: 'Component',
      ui: {
        searchFields: ['name'],
        description: `This field will show only when ${oldScriptRelatedVerticals.join(
          ', ',
        )} verticals or showOnBundle is selected`,
        views: path.join(process.cwd(), './src/customFields/Script/oldVerticalsOrShowOnBundle/views'),
      },
    }),
    brand: multiselect({
      type: 'enum',
      options: [
        { label: 'CIMET', value: 'cimet' },
        { label: 'iSelect', value: 'iselect' },
        { label: 'CTM', value: 'ctm' },
      ],
    }),
    category: select({
      type: 'enum',
      options: [
        { label: 'Mandatory read', value: 'mandatory' },
        { label: 'Agent response', value: 'agent_response' },
        { label: 'Optional', value: 'optional' },
      ],
      defaultValue: 'optional',
      validation: { isRequired: true },
      ui: { displayMode: 'select' },
    }),
    connectionType: select({
      type: 'enum',
      options: [
        { label: 'NBN', value: 'nbn' },
        { label: 'ADSL', value: 'adsl' },
        { label: 'Cable', value: 'cable' },
        { label: '4G home internet', value: 'four_g' },
        { label: '5G home internet', value: 'five_g' },
        { label: 'OptiComm', value: 'opti' },
        { label: 'LBN', value: 'lbn' },
        { label: 'Mobile broadband', value: 'mobile' },
      ],
      ui: { displayMode: 'select' },
    }),
    technologyType: select({
      type: 'enum',
      options: [
        { label: 'FTTB', value: 'fttb' },
        { label: 'FTTP', value: 'fttp' },
        { label: 'FTTN', value: 'fttn' },
        { label: 'FTTC', value: 'fttc' },
        { label: 'HFC', value: 'hfc' },
        { label: 'Satellite', value: 'satellite' },
        { label: 'Wireless', value: 'wireless' },
      ],
      ui: { displayMode: 'select' },
    }),
    affiliates: relationship({
      ref: 'Affiliate.scripts',
      many: true,
      ui: { hideCreate: true },
    }),
    subAffiliates: relationship({
      ref: 'SubAffiliate.scripts',
      many: true,
      ui: { hideCreate: true },
    }),
    providers: relationship({ ref: 'Provider.scripts', many: true }),
    plans: relationship({ ref: 'Plan.scripts', many: true }),
    addonFields: relationship({ ref: 'AddonField.scripts', many: true, label: 'Addons' }),
    pages: relationship({
      ref: 'Page.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${oldScriptRelatedVerticals.join(
          ', ',
        )} verticals or showOnBundle is selected`,
        views: path.join(process.cwd(), './src/customFields/Script/oldVerticalsOrShowOnBundle/views'),
      },
    }),
    position: select({
      type: 'enum',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Bottom', value: 'bottom' },
      ],
      defaultValue: 'top',
      ui: { displayMode: 'select' },
    }),
    order: integer({
      defaultValue: 0,
    }),
    content: document({
      formatting: true,
      links: true,
      layouts: [[1, 1], [1, 1, 1], [2, 1], [1, 2], [1, 2, 1], [1]],
      dividers: true,
      ui: {
        views: path.join(process.cwd(), './src/componentBlocks'),
      },
      componentBlocks,
    }),
    // Credit Card
    ccProviders: relationship({
      ref: 'ProviderCreditCard.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
      },
    }),
    ccFormContainers: relationship({
      ref: 'CCFormContainer.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
        labelField: 'label',
      },
    }),
    // Personal Loan
    plProviders: relationship({
      ref: 'PLProvider.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
      },
    }),
    plFormContainers: relationship({
      ref: 'PLFormContainer.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
        labelField: 'label',
      },
    }),
    // Health Insurance
    hiProviders: relationship({
      ref: 'HIProvider.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
      },
    }),
    hiFormContainers: relationship({
      ref: 'HIFormContainer.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
        labelField: 'label',
      },
    }),
    formComponents: relationship({
      ref: 'FormComponent.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
      },
    }),
    formFields: relationship({
      ref: 'FormField.scripts',
      many: true,
      ui: {
        description: `This field will show only when ${newScriptRelatedVerticals.join(', ')} are selected`,
        views: path.join(process.cwd(), './src/customFields/Script/newVerticals/views'),
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['title', 'verticals', 'brand', 'component', 'pages'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Script),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
