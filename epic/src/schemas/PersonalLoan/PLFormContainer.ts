import { list } from '@keystone-6/core'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { commonFormContainerFields } from '../Common/common'
import { addAffiliates, addSubAffiliates, resolveAffiliates } from '../Common/utils/common'

const PLFormContainer = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...commonFormContainerFields('PLProvider', 'plFormContainer', 'plFormContainers'),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    listView: {
      initialColumns: ['id', 'provider', 'page', 'v2'],
    },
    label: 'Application Journey',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLFormContainer),
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

export default PLFormContainer
