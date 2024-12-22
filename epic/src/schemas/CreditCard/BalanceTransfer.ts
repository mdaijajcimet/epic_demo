import { list } from '@keystone-6/core'
import { text, relationship, integer, checkbox, multiselect } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { customDecimal, readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const BalanceTransfer = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'BalanceTransfer', 'BT'),
    creditCard: relationship({
      ref: 'CreditCard.balanceTransfer',
      many: false,
      ui: readOnly({}, 'sidebar'),
    }),
    btIntro: customDecimal(),
    btIntroTerm: integer({ validation: { min: 0 }, label: 'BT Intro Term' }),
    btRateStandard: customDecimal(),
    btConditions: text({
      label: 'BT Conditions',
      ui: { displayMode: 'textarea', listView: { fieldMode: 'hidden' } },
    }),
    minBTAmount: customDecimal({ label: 'Min BT Amount ($)' }),
    maxBTAmount: customDecimal({ label: 'Max BT Amount (%)' }),
    btRevertRate: customDecimal(),
    isBTFromPersonalLoanAllowed: checkbox({ label: 'Is BT from personal loan allowed?' }),
    btFeeDollars: customDecimal({ label: 'BT Fee ($)' }),
    btFeePercent: customDecimal({ label: 'BT Fee (%)' }),

    btNotAllowedFromBanks: multiselect({
      type: 'enum',
      options: [
        {
          label: 'Citi',
          value: 'citi',
        },
        {
          label: 'Westpac',
          value: 'westpac',
        },
      ],
      label: 'BT not allowed from banks',
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.BalanceTransfer, { hideCreate: true }),
  },
})

export default BalanceTransfer
