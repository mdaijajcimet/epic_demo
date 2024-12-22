import { group, list } from '@keystone-6/core'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { affiliatesSchemaFields, commonProviderSchemaFields } from '../Common/common'
import { addAffiliates, addSubAffiliates, commonCardUI, resolveAffiliates } from '../Common/utils/common'
import { relationship } from '@keystone-6/core/fields'
import { CommonFormContainerFields } from '../Common/constants'
import { clickoutSchemaFields } from '../Common/utils/schema'

const HIProvider = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...commonProviderSchemaFields(),
    ...affiliatesSchemaFields('hiProvider'),
    ...group({
      label: '[ Section ] - Form Containers',
      fields: {
        formContainer: relationship({
          ref: 'HIFormContainer.provider',
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
        scripts: relationship({ ref: 'Script.hiProviders', many: true }),
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
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.HIProvider),
  },
})

export default HIProvider
