import { list } from '@keystone-6/core'
import { integer, relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { customDecimal, readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const Rates = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'Rate', 'Rate'),
    creditCard: relationship({ ref: 'CreditCard.rates', many: false, ui: readOnly({}, 'sidebar') }),
    cashAdvRateIntro: customDecimal(),
    cashAdvRateIntroTerm: integer({
      validation: { min: 0 },
      ui: {
        description: 'Intro Period in Months',
      },
    }),
    cashAdvRateStandard: customDecimal(),
    purchaseRateIntro: customDecimal(),
    purchaseRateIntroTerm: integer({
      validation: { min: 0 },
      ui: {
        description: 'Intro Period in Months',
      },
    }),
    purchaseRateStandard: customDecimal(),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Rates',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Rate, { hideCreate: true }),
  },
})

export default Rates
