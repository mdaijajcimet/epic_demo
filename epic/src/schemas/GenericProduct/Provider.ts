import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { checkbox, json, relationship, text } from '@keystone-6/core/fields'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { nestedSelect } from '../../customFields/nestedSelect'
import { createdAtSchema, slugSchema, statusSchema, updatedAtSchema } from '../Common/common'
import { validateSingleRelations } from '../Common/utils/relationshipValidators'
import { getFormOptionKeyDesc } from '../../utils/schemas'
import { FORM_OPTION_KEYS } from '../../constants/schema'

const GenericProvider = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    slug: slugSchema(),
    businessName: text({ validation: { isRequired: true } }),
    legalName: text({ validation: { isRequired: true } }),
    vertical: relationship({ ref: 'Vertical', many: false, ui: { hideCreate: true } }),
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
        labelField: 'label',
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
      label: 'Disallow Subffiliates',
      ui: { description: 'Assign Disallow SubAffiliates', hideCreate: true },
    }),
    country: nestedSelect({
      options: [],
      filterKey: FORM_OPTION_KEYS.COUNTRY_LIST,
      isDynamic: true,
      ui: { description: getFormOptionKeyDesc(FORM_OPTION_KEYS.COUNTRY_LIST) },
    }),
    logos: relationship({
      ref: 'Logo',
      many: true,
    }),
    plans: relationship({
      ref: 'GenericPlan.provider',
      many: true,
    }),
    addons: relationship({ ref: 'GenericAddon.provider', many: true }),
    qaEmails: relationship({
      ref: 'Member',
      many: true,
      label: 'QA Users',
      ui: {
        hideCreate: true,
      },
    }),
    termsCondition: text({
      label: 'Provider Terms & Condition',
      ui: { views: path.join(process.cwd(), './src/customFields/CustomEditor') },
    }),
    postSubmissionContent: text({
      label: 'Post Submission Content (What Happens Next Content)',
      ui: {
        views: path.join(process.cwd(), './src/customFields/CustomEditor'),
      },
    }),
    applyNowContent: text({ ui: { views: path.join(process.cwd(), './src/customFields/CustomEditor') } }),
    status: statusSchema('Enable / Disable Provider'),
    csStatus: statusSchema('Enable / Disable on Frontend'),
    agentStatus: statusSchema('Enable / Disable on Agents'),
    applyStatus: statusSchema('Enable / Disable Apply Now Content'),
    customConfig: json({ label: 'Other Config' }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  ui: {
    labelField: 'name',
    isHidden: true,
  },
  hooks: {
    validate: async (args) => {
      if (args.operation === 'delete') return

      const { operation, resolvedData, addValidationError, context } = args
      const { slug } = resolvedData

      const count = await context.query.GenericProvider.count({
        where: { slug: { equals: slug } },
      })
      if (operation === 'create' && count) {
        addValidationError('Violating unique constraint: slug')
      }
      validateSingleRelations<'list'>(args, ['vertical'])
    },
    afterOperation: async (args) => {
      await registerAuditLog(args)
    },
  },
})

export default GenericProvider
