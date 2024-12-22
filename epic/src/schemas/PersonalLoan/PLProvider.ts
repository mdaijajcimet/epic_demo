import { group, list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { affiliatesSchemaFields, commonProviderSchemaFields } from '../Common/common'
import { CommonFormContainerFields, CommonPlanFields } from '../Common/constants'
import { addAffiliates, addSubAffiliates, commonCardUI, resolveAffiliates } from '../Common/utils/common'
import { clickoutSchemaFields } from '../Common/utils/schema'

const PLProvider = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...commonProviderSchemaFields(),
    ...affiliatesSchemaFields('plProvider'),
    ...group({
      label: '[ Section ] - Personal Loans',
      fields: {
        loans: relationship({
          ref: 'PersonalLoan.provider',
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
          ref: 'PLFormContainer.provider',
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
      label: '[ Section ] - Scripts',
      fields: {
        scripts: relationship({ ref: 'Script.plProviders', many: true }),
      },
    }),
    ...clickoutSchemaFields(),
    ...TIMESTAMP_SCHEMA,
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
  ui: {
    label: 'Providers',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLProvider),
  },
})

export default PLProvider
