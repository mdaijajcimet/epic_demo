import { list } from '@keystone-6/core'
import { integer, multiselect, relationship, select, text, checkbox } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { customDecimal, readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

import { verticalLabelVirtualField } from '../Common/utils/schema'

const CardDetail = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'CardDetail', 'Details'),
    creditCard: relationship({ ref: 'CreditCard.details', many: false, ui: readOnly({}, 'sidebar') }),
    cardNetwork: select({
      options: [
        { label: 'Visa', value: 'visa' },
        { label: 'MasterCard', value: 'mastercard' },
        { label: 'AMEX', value: 'amex' },
        { label: "Diner's club", value: 'dinersClub' },
      ],
      defaultValue: 'visa',
      validation: { isRequired: true },
      ui: { displayMode: 'segmented-control', itemView: { fieldPosition: 'sidebar' } },
    }),
    cardLevel: select({
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
        { label: 'Premium', value: 'premium' },
      ],
      defaultValue: 'standard',
      validation: { isRequired: true },
      ui: { displayMode: 'segmented-control', itemView: { fieldPosition: 'sidebar' } },
    }),
    isLowRate: checkbox(),
    isLowFee: checkbox(),
    isReward: checkbox(),
    isStoreCard: checkbox(),
    quickApproval: checkbox(),
    hasCashbackOffers: checkbox(),
    interestFreeDays: integer({ validation: { min: 0 } }),
    interestFreeDaysDescription: text(),
    minRepaymentDollars: customDecimal(),
    minRepaymentPercent: customDecimal(),
    minCreditLimit: integer({ validation: { min: 0 } }),
    maxCreditLimit: integer({ validation: { min: 0 } }),
    ewalletPaymentOptions: multiselect({
      type: 'string',
      options: [
        { label: 'Apple Pay', value: 'applePay' },
        { label: 'Google Pay', value: 'googlePay' },
        { label: 'Samsung Pay', value: 'samsungPay' },
      ],
    }),
    calculationMethodology: text(),
    bonusPoints: integer({ validation: { min: 0 } }),
    bonusPointDescription: text(),
    cashbackDiscounts: text({ ui: { displayMode: 'textarea' } }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Details',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CardDetail, { hideCreate: true }),
  },
})

export default CardDetail
