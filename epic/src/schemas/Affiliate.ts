import { graphql, group, list } from '@keystone-6/core'
import { integer, relationship, text, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { readOnly } from '../utils'
import { FieldAccessMap, ModuleOpAccessArgs, getFieldAccessUI, getModuleUIArgs } from '../utils/access'
import { statusSchema } from './Common/common'

export const Affiliate = list({
  access: ModuleOpAccessArgs,
  fields: {
    status: statusSchema('Enabled/Disabled Affiliate', true, true),
    name: text({
      ui: readOnly({}, 'sidebar'),
    }),
    affiliateId: text({
      isIndexed: 'unique',
      ui: readOnly({}, 'sidebar'),
    }),
    affiliateNumber: integer({
      ui: readOnly({}, 'sidebar'),
    }),
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          const label = item?.name + (item?.status ? '' : ' (DISABLED)')
          return label
        },
      }),
      ui: readOnly({}),
    }),
    senderID: text({
      ui: readOnly({}, 'sidebar'),
    }),
    emailDomains: text({
      ui: readOnly(
        {
          description: 'comma seperated list of email domains allowed for affiliate',
        },
        'sidebar',
      ),
    }),
    apiKey: text({
      access: FieldAccessMap,
      ui: getFieldAccessUI('Affiliate', 'apiKey'),
    }),
    ...group({
      label: 'SubAffiliates',
      fields: {
        subAffiliates: relationship({
          ref: 'SubAffiliate.affiliate',
          many: true,
          ui: readOnly({}),
        }),
      },
    }),
    ...group({
      label: 'Scripts',
      fields: {
        scripts: relationship({ ref: 'Script.affiliates', many: true }),
      },
    }),
    ...group({
      label: 'Credit Cards',
      fields: {
        ccProvider: relationship({
          ref: 'ProviderCreditCard.affiliate',
          many: true,
          label: 'CC Providers',
          ui: { hideCreate: true },
        }),
        ccPlan: relationship({
          ref: 'CreditCard.affiliate',
          many: true,
          label: 'CC Plans',
          ui: { hideCreate: true },
        }),
        ccFormContainer: relationship({
          ref: 'CCFormContainer.affiliate',
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
          ref: 'PLProvider.affiliate',
          many: true,
          label: 'PL Providers',
          ui: { hideCreate: true },
        }),
        plPlan: relationship({
          ref: 'PersonalLoan.affiliate',
          many: true,
          label: 'PL Plans',
          ui: { hideCreate: true },
        }),
        plFormContainer: relationship({
          ref: 'PLFormContainer.affiliate',
          many: true,
          label: 'PL Containers',
          ui: { hideCreate: true },
        }),
      },
    }),
    ...group({
      label: 'Health insurance',
      fields: {
        hiProvider: relationship({
          ref: 'HIProvider.affiliate',
          many: true,
          label: 'HI Providers',
          ui: { hideCreate: true },
        }),
        hiFormContainer: relationship({
          ref: 'HIFormContainer.affiliate',
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
          ref: 'BundleFormContainer.affiliate',
          many: true,
          label: 'Bundle Pages',
          ui: { hideCreate: true },
        }),
      },
    }),
  },
  ui: {
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Affiliate, { hideCreate: true, hideDelete: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
