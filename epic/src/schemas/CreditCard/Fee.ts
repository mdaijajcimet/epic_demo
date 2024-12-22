import { list } from '@keystone-6/core'
import { integer, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { customDecimal, readOnly } from '../../utils'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const CreditCardFee = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'CreditCardFee', 'Fee'),
    creditCard: relationship({ ref: 'CreditCard.fees', many: false, ui: readOnly({}, 'sidebar') }),
    annualFeeIntro: customDecimal(),
    annualFeeIntroTerm: integer({
      ui: {
        description: 'Intro Period in Months',
      },
    }),
    annualFeeStandard: customDecimal({ defaultValue: '0' }),
    annualFeeSpendWaiver: customDecimal(),
    annualFeeSpendWaiverTerm: integer(),
    annualFeeOtherWaiver: text({
      ui: { description: 'Conditions on Annual Fee Spend Waiver', displayMode: 'textarea' },
    }),
    cashAdvanceMinFee: customDecimal({ label: 'Cash Advance Fee - Minimum' }),
    cashAdvanceMaxFee: customDecimal({ label: 'Cash Advance Fee - Maximum' }),
    cashAdvancePercent: customDecimal({ label: 'Cash Advance Rate (%)' }),
    atmFeeStandard: customDecimal(),
    latePaymentFee: customDecimal(),
    additionalCardHolders: integer(),
    additionalCardHoldersFee: customDecimal(),
    crossBorderFee: customDecimal({ label: 'Cross Border Fee ($)' }),
    crossBorderFeePercent: customDecimal({ label: 'Cross Border Fee (%)' }),
    overLimitFee: customDecimal(),
    duplicateStatementFee: customDecimal(),
    dishonourFee: customDecimal(),
    paperStatementFee: customDecimal(),
    informationRequestFee: customDecimal(),
    voucherRequestFee: customDecimal(),
    overTheCounterTransactionFee: customDecimal(),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Fees',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CreditCardFee, { hideCreate: true }),
  },
})

export default CreditCardFee
