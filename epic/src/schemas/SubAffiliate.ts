/* eslint-disable @typescript-eslint/no-explicit-any */
import { list, graphql, group } from '@keystone-6/core'
import { integer, relationship, text, virtual } from '@keystone-6/core/fields'
import registerAuditLog from '../../registerAuditLog'
import { readOnly } from '../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../utils/access'
import { statusSchema } from './Common/common'
import { LIST_ACCESS_KEY_MAP } from '../config/access'

export const SubAffiliate = list({
  access: ModuleOpAccessArgs,
  fields: {
    status: statusSchema('Enable / Disable SubAffiliate', true, true),
    name: text({ ui: readOnly({}, 'sidebar') }),
    subAffiliateId: text({
      isIndexed: 'unique',
      ui: readOnly({}, 'sidebar'),
    }),
    assignedVertical: text({
      ui: readOnly({}, 'sidebar'),
    }),
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, any>, _args, context) {
          let affiliate
          if (item?.affiliateId) {
            const affName = await context.query?.Affiliate.findOne({
              where: {
                id: item?.affiliateId?.toString(),
              },
              query: 'name',
            })
            affiliate = affName?.name
          }
          const label =
            item?.name + (affiliate ? ` [${affiliate}]` : '') + (item?.status ? '' : ' (DISABLED)')
          return label
        },
      }),
    }),
    subAffiliateNumber: integer({ ui: readOnly({}, 'sidebar') }),
    rcCodes: text({
      ui: readOnly(
        {
          description: `Please put multiple rcCodes separated by comma and space, e.g. 123, 456, 789`,
        },
        'sidebar',
      ),
    }),
    apiKey: text(),
    gtmId: text(),
    affiliate: relationship({
      ref: 'Affiliate.subAffiliates',
      many: false,
      ui: readOnly({}, 'sidebar'),
    }),
    emailDomains: text({
      ui: readOnly(
        {
          description: 'comma seperated list of email domains allowed for sub-affiliate',
        },
        'sidebar',
      ),
    }),
    ...group({
      label: 'Scripts',
      fields: {
        scripts: relationship({ ref: 'Script.subAffiliates', many: true }),
      },
    }),
    ...group({
      label: 'Credit Cards',
      fields: {
        ccProvider: relationship({
          ref: 'ProviderCreditCard.subAffiliate',
          many: true,
          label: 'CC Providers',
          ui: { hideCreate: true },
        }),
        ccPlan: relationship({
          ref: 'CreditCard.subAffiliate',
          many: true,
          label: 'CC Plans',
          ui: { hideCreate: true },
        }),
        ccFormContainer: relationship({
          ref: 'CCFormContainer.subAffiliate',
          many: true,
          label: 'CC Containers',
          ui: { hideCreate: true },
        }),
      },
    }),
    ...group({
      label: 'Personal Loans',
      fields: {
        plProvider: relationship({
          ref: 'PLProvider.subAffiliate',
          many: true,
          label: 'PL Providers',
          ui: { hideCreate: true },
        }),
        plPlan: relationship({
          ref: 'PersonalLoan.subAffiliate',
          many: true,
          label: 'PL Plans',
          ui: { hideCreate: true },
        }),
        plFormContainer: relationship({
          ref: 'PLFormContainer.subAffiliate',
          many: true,
          label: 'PL Containers',
          ui: { hideCreate: true },
        }),
      },
    }),
    ...group({
      label: 'Health Insurance',
      fields: {
        hiProvider: relationship({
          ref: 'HIProvider.subAffiliate',
          many: true,
          label: 'HI Providers',
          ui: { hideCreate: true },
        }),
        hiFormContainer: relationship({
          ref: 'HIFormContainer.subAffiliate',
          many: true,
          label: 'HI Containers',
          ui: { hideCreate: true },
        }),
      },
    }),
    ...group({
      label: 'Bundle',
      fields: {
        bundleFormContainer: relationship({
          ref: 'BundleFormContainer.subAffiliate',
          many: true,
          label: 'Bundle Pages',
          ui: { hideCreate: true },
        }),
      },
    }),
  },
  ui: {
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.SubAffiliate, { hideCreate: true, hideDelete: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
