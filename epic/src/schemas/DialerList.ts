import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { encryptedText } from '../customFields/encryptedText'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../utils/access'

export const DialerList = list({
  access: ModuleOpAccessArgs,
  fields: {
    username: text({
      validation: { isRequired: true },
    }),
    password: encryptedText({
      validation: { isRequired: true },
    }),
    url: text({
      validation: { isRequired: true },
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.DialerList),
  },
})
