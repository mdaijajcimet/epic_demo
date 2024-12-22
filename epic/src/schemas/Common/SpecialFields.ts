import { text, multiselect, timestamp, select } from '@keystone-6/core/fields'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'

export default {
  name: text({ validation: { isRequired: true } }),
  type: multiselect({
    type: 'string',
    options: [
      { label: 'Balance Transfer', value: 'balance_transfer' },
      { label: 'Bonus Points', value: 'bonus_points' },
      { label: 'Gift Cards', value: 'gift_cards' },
      { label: 'Purchase Offers', value: 'purchase_offers' },
      { label: 'Cashback', value: 'cashback' },
      { label: 'Other', value: 'other' },
    ],
  }),
  offerType: select({
    options: [
      { label: 'Offer', value: 'offer' },
      { label: 'Special Offer', value: 'specialOffer' },
      { label: 'Exclusive Offer', value: 'exclusiveOffer' },
    ],
    defaultValue: 'offer',
    validation: { isRequired: true },
  }),
  introText: text(),
  blurb: text(),
  startDate: timestamp({
    validation: { isRequired: true },
  }),
  endDate: timestamp({
    hooks: {
      validateInput: async ({ addValidationError, resolvedData }) => {
        const currentDate = new Date()
        const startDateEntered: any = resolvedData?.startDate
        const endDateEntered = resolvedData.endDate

        if (startDateEntered < currentDate) addValidationError('Enter a valid start date')

        if (endDateEntered < startDateEntered) addValidationError('Enter a valid end date')
      },
    },
  }),
  url: text(),
  ...TIMESTAMP_SCHEMA,
}
