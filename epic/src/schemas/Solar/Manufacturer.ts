import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const Manufacturer = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      isFilterable: true,
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Manufacturer),
  },
})

export default Manufacturer
