import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { customDecimal, readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const OverseasSpend = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'OverseasSpend', 'OverseasSpend'),
    creditCard: relationship({ ref: 'CreditCard.overseasSpends', many: false, ui: readOnly({}, 'sidebar') }),
    foreignExchangeFeeStandard: customDecimal({
      label: 'Foreign Exchange Rate',
      ui: { description: 'Currency conversion fee per transaction ' },
    }),
    overseascashAdvancerate: customDecimal({ label: 'Overseas Cash Advance Rate' }),
    cashAdvanceFeeInternational: customDecimal({ label: 'Cash Advance Fee International ($)' }),
    cashAdvanceFeeInternationalPercent: customDecimal({ label: 'Cash Advance Fee International (%)' }),
    fxATMFeeDollar: customDecimal({
      label: 'Overseas ATM Charges ($)',
      ui: { description: 'considered only for other banks' },
    }),
    fxATMFeePercent: customDecimal({
      label: 'Overseas ATM Charges (%)',
      ui: { description: 'considered only for other banks' },
    }),
    overseasReplaceCardFee: customDecimal({ label: 'Overseas Card Replacement Fee' }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Overseas Spends',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.OverseasSpend, { hideCreate: true }),
  },
})

export default OverseasSpend
