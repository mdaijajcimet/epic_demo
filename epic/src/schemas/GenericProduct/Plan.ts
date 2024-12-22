import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { checkbox, integer, json, relationship, text } from '@keystone-6/core/fields'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { createdAtSchema, statusSchema, updatedAtSchema } from '../Common/common'
import { validateSingleRelations } from '../Common/utils/relationshipValidators'
import {
  cardConsentUI,
  cardContentUIBase,
  cardFeatureUI,
  cardNumericUIBase,
  cardTextUIBase,
} from './constants'

const GenericPlan = list({
  access: allowAll,
  fields: {
    label: text({
      validation: { isRequired: true },
      ui: { description: 'This label is for Epic only. It will show up on all relationships.' },
    }),
    name: text({ validation: { isRequired: true } }),
    description: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardContentUIBase },
      many: false,
    }),
    benefits: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardNumericUIBase },
      many: true,
    }),
    features: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardFeatureUI },
      many: true,
    }),
    parameters: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardNumericUIBase },
      many: true,
    }),
    attachments: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardTextUIBase },
      many: true,
    }),
    termsCondition: relationship({
      ref: 'GenericPlanField',
      many: false,
      ui: {
        ...cardContentUIBase,
      },
    }),
    specialOffer: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardFeatureUI },
      many: false,
    }),
    preferenceOrder: integer(),
    viewDetails: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardContentUIBase },
      many: false,
    }),
    clickoutURL: relationship({
      ref: 'GenericPlanField',
      ui: { ...cardFeatureUI },
      many: false,
    }),
    consents: relationship({ ref: 'CheckBoxContent', many: true, ui: { ...cardConsentUI } }),
    provider: relationship({ ref: 'GenericProvider.plans', many: false }),
    affiliates: relationship({
      ref: 'Affiliate',
      many: true,
      ui: { description: 'Assign Affiliates', hideCreate: true },
    }),
    includeAllSubAff: checkbox({
      defaultValue: true,
      label: 'Include Affiliates SubAffiliates',
      ui: {
        description:
          'By default, all subaffiliates of selected Affiliates got mapped. If unchecked, no subaffiliate of above affiliates will be mapped',
      },
    }),
    subAffiliates: relationship({
      ref: 'SubAffiliate',
      many: true,
      ui: {
        description: 'Assign SubAffiliates (Select subaffiliates which you want to be picked manually)',
        hideCreate: true,
      },
    }),
    disallowAff: relationship({
      ref: 'Affiliate',
      many: true,
      label: 'Disallow Affiliates',
      ui: { description: 'Assign Disallow Affiliates', hideCreate: true },
    }),
    disallowSubaff: relationship({
      ref: 'SubAffiliate',
      many: true,
      label: 'Disallow Subaffiliates',
      ui: { description: 'Assign Disallow SubAffiliates', hideCreate: true },
    }),
    addons: relationship({ ref: 'GenericAddon.plans', many: true }),
    applyNowContent: text({ ui: { views: path.join(process.cwd(), './src/customFields/CustomEditor') } }),
    status: statusSchema('Enable / Disable Plan'),
    csStatus: statusSchema('Enable / Disable on Frontend'),
    agentStatus: statusSchema('Enable / Disable on Agents'),
    viewStatus: statusSchema('Enable / Disable on View Details'),
    agentSendStatus: statusSchema('Enable / Disable on Agents Send Plan Email'),
    clickoutStatus: statusSchema('Enable / Disable Click-out Option'),
    inboundCallStatus: statusSchema('Enable / Disable Inbound CTA', false),
    applyStatus: statusSchema('Enable / Disable Apply Now Content'),
    agentApplyStatus: statusSchema('Hide Apply Now from Frontend, Allow on Agents Only', false),
    customConfig: json({ label: 'Other Config' }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  ui: {
    labelField: 'label',
    isHidden: true,
  },
  hooks: {
    validate: (args) => {
      if (args.operation === 'delete') return
      validateSingleRelations<'list'>(args, ['provider'])
    },
    afterOperation: async (args) => {
      registerAuditLog(args)
    },
  },
})

export default GenericPlan
