import { list } from '@keystone-6/core'
import { checkbox, integer, relationship, select, text } from '@keystone-6/core/fields'
import isNil from 'lodash/isNil'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { customDecimal, readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const EarnRate = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'EarnRate', 'Rate'),
    creditCard: relationship({ ref: 'CreditCard.earnRates', many: false, ui: readOnly({}, 'sidebar') }),
    isGenericEarnRate: checkbox({
      defaultValue: true,
      ui: {
        description: 'if checked only , will be considered for Max Annual points calculation',
        itemView: { fieldPosition: 'sidebar' },
      },
    }),
    isUncappedEarnRate: checkbox({
      defaultValue: false,
      ui: {
        description: 'Check this box if you want to allow an uncapped earn rate on your credit card.',
        itemView: { fieldPosition: 'sidebar' },
      },
    }),
    pointsEarned: customDecimal({}, { isRequired: true }),
    spendAt: text(),
    rangeMinimum: integer(),
    rangeMax: integer(),
    rangeUnit: select({
      type: 'enum',
      options: [
        {
          label: 'Points',
          value: 'points',
        },
        {
          label: 'Dollars',
          value: 'dollars',
        },
      ],
      ui: { displayMode: 'segmented-control' },
    }),
    rangePeriod: select({
      type: 'enum',
      options: [
        {
          label: 'Monthly',
          value: 'monthly',
        },
        {
          label: 'Annually',
          value: 'annually',
        },
      ],
      ui: { displayMode: 'segmented-control' },
    }),
  },
  hooks: {
    validate: async ({ operation, resolvedData, item, addValidationError }) => {
      if (operation === 'delete') return

      const reqFields = ['rangeMax', 'rangeMinimum', 'rangeUnit', 'rangePeriod']

      const updatedData = { ...resolvedData }
      const isUncappedEarnRate = updatedData.isUncappedEarnRate ?? item?.isUncappedEarnRate

      if (operation === 'update') {
        reqFields?.forEach((field) => {
          if (updatedData[field] === undefined) updatedData[field] = item?.[field]
        })
      }
      if ((operation === 'update' || operation === 'create') && !isUncappedEarnRate) {
        reqFields?.forEach((field) => {
          if (isNil(updatedData?.[field])) {
            addValidationError(`${field} is required`)
          }
        })
        const rangeMax = resolvedData['rangeMax'] ?? item?.['rangeMax']
        if (rangeMax < (resolvedData['rangeMinimum'] || item?.['rangeMinimum'])) {
          addValidationError('RangeMaximum Should be greater than RangeMinimum')
        }
      }
    },
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Earn Rates',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.EarnRate, { hideCreate: true }),
  },
})

export default EarnRate
