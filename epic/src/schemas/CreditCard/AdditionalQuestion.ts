import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { formCompUtilityFields } from '../Common/common'

const AdditionalQuestion = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    creditCard: relationship({
      ref: 'CreditCard.additionalQuestions',
      many: true,
      ui: readOnly({}, 'sidebar'),
    }),
    ...formCompUtilityFields,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.AdditionalQuestion, { hideCreate: true }),
  },
})

export default AdditionalQuestion
