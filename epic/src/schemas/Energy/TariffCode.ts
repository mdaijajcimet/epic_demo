import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

export default list({
  access: {
    ...ModuleOpAccessArgs,
  },
  fields: {
    serialNo: text(),
    distributor: text(),
    provider: text(),
    propertyType: text(),
    states: text(),
    tariffCode: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),
    tariffType: text(),
    vertical: text(),
  },
  hooks: {
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.TariffCode),
  },
})
