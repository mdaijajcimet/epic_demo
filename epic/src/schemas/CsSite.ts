import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { FieldAccessMap, ModuleOpAccessArgs, getFieldAccessUI, getModuleUIArgs } from '../utils/access'

export const CsSite = list({
  access: ModuleOpAccessArgs,
  fields: {
    site: text(),
    slug: text({ validation: { isRequired: true } }),
    apiKey: text({
      access: FieldAccessMap,
      ui: getFieldAccessUI('CsSite', 'apiKey'),
    }),
    gtmId: text(),
    recaptchaKey: text(),
    affiliate: relationship({ ref: 'Affiliate', many: false }),
    affAuthUrl: text(),
    affAuthQuery: text({ defaultValue: 'token' }),
    affAuthCallbackUrl: text(),
  },
  ui: {
    labelField: 'site',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CsSite),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
