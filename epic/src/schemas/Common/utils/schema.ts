import { graphql, group } from '@keystone-6/core'
import { integer, json, multiselect, select, text, virtual } from '@keystone-6/core/fields'
import path from 'path'

import { TIMESTAMP_SCHEMA } from '../../../constants/schema'

export const eligibiltyFields = {
  minAge: integer({ validation: { min: 0 } }),
  minIncome: integer({ validation: { min: 0 } }),
  eligibilityCondition: text({
    ui: {
      displayMode: 'textarea',
      description: 'Add a new eligibility per line. E.g \nThis is eligibility 1 \nThis is eligibility 2',
    },
  }),
  residency: multiselect({
    type: 'string',
    options: [
      {
        label: 'Australian Citizen',
        value: 'citizen',
      },
      {
        label: 'Permanent Resident',
        value: 'permanentResident',
      },
      {
        label: 'Visa Holder',
        value: 'visaHolder',
      },
    ],
  }),
  visaValidity: integer({
    validation: { min: 1 },
    ui: { description: 'The minimum number of months the Visa should be valid for' },
  }),
  ...TIMESTAMP_SCHEMA,
}

export const perkFields = {
  name: text({ validation: { isRequired: true } }),
  type: multiselect({
    options: [
      { label: 'Airport lounge', value: 'airport_lounge' },
      { label: 'Concierge', value: 'concierge' },
      { label: 'Discounted annual fee', value: 'discounted_annual_fee' },
      { label: 'Extended warranty', value: 'extended_warranty' },
      { label: 'Fraud protection', value: 'fraud_protection' },
      { label: 'Rental car excess insurance', value: 'rental_car_excess_insurance' },
      { label: 'Free domestic travel insurance', value: 'domestic_travel' },
      { label: 'Free international travel insurance', value: 'international_travel' },
      { label: 'No international transaction fee', value: 'no_international_transaction_fee' },
      { label: 'Purchase Protection insurance ', value: 'purchase_protection_insurance' },
    ],
    label: 'Perk Type',
  }),
  value: integer(),
  assumptions: text(),
  conditions: text(),
  days: integer(),
  daysConditions: text(),
}

export const verticalLabelVirtualField = (queryName: string, table: string, suffix = '') => {
  return {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, unknown>, _args, context) {
          let label = item?.id?.toString()
          const data = await context.query?.[table].findOne({
            where: {
              id: item?.id?.toString(),
            },
            query: `${queryName}{name}`,
          })
          const name = data?.[queryName]?.name || data?.[queryName]?.[0]?.name
          if (name) label = `${name} ${suffix ? `- ${suffix}` : ''}`
          return label
        },
      }),
    }),
  }
}

export const clickoutSchemaFields = () => ({
  ...group({
    label: '[ Section ] - Clickout URL',
    fields: {
      clickoutStatus: select({
        label: 'Do you want to have clickout option?',
        options: [
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ],
        defaultValue: 'no',
        validation: { isRequired: true },
        ui: { displayMode: 'segmented-control' },
      }),
      clickoutParams: json({
        ui: {
          views: path.join(process.cwd(), './src/customFields/ClickoutUrl'),
        },
        label: 'Clickout Parameters',
        hooks: {
          validate: ({ addValidationError, inputData, item, operation }) => {
            if (operation === 'delete') return
            if (inputData?.clickoutStatus === 'yes' && !inputData?.clickoutParams && !item?.clickoutParams) {
              addValidationError('Enter clickout url data first & then click on Add Data field to save')
            }
          },
        },
      }),
    },
  }),
})
