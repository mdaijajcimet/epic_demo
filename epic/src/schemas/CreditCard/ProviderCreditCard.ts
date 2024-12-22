import { group, list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { affiliatesSchemaFields, commonProviderSchemaFields } from '../Common/common'
import { CommonFormContainerFields, CommonPlanFields, CommonUploadFields } from '../Common/constants'
import { addAffiliates, addSubAffiliates, commonCardUI, resolveAffiliates } from '../Common/utils/common'
import { clickoutSchemaFields } from '../Common/utils/schema'

const ProviderCreditCard = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...commonProviderSchemaFields(),
    ...affiliatesSchemaFields('ccProvider'),
    ...group({
      label: '[ Section ] - Credit Cards',
      fields: {
        creditCards: relationship({
          ref: 'CreditCard.provider',
          many: true,
          ui: {
            ...commonCardUI({
              inlineFields: CommonPlanFields,
            }),
          },
        }),
      },
    }),
    ...group({
      label: '[ Section ] - Form Containers',
      fields: {
        formContainer: relationship({
          ref: 'CCFormContainer.provider',
          many: true,
          ui: {
            ...commonCardUI({
              inlineFields: CommonFormContainerFields,
              inlineConnect: true,
              hideRemove: false,
            }),
          },
        }),
      },
    }),
    ...group({
      label: '[ Section ] - Upload Group',
      description: 'By default enabled for all credit cards',
      fields: {
        uploadGroup: relationship({
          ref: 'CCUploadGroup.provider',
          many: true,
          ui: {
            ...commonCardUI({
              inlineFields: CommonUploadFields,
              inlineConnect: true,
              hideRemove: false,
            }),
          },
        }),
      },
    }),
    ...group({
      label: '[ Section ] - Scripts',
      fields: {
        scripts: relationship({ ref: 'Script.ccProviders', many: true }),
      },
    }),
    ...clickoutSchemaFields(),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    label: 'Providers',
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.ProviderCreditCard),
  },
  hooks: {
    resolveInput: async (data) => {
      const resolvedData = await resolveAffiliates(data)
      return resolvedData
    },
    afterOperation: async (data) => {
      await addAffiliates(data)
      await Promise.all([addSubAffiliates(data), registerAuditLog(data)])
    },
  },
})

export default ProviderCreditCard
