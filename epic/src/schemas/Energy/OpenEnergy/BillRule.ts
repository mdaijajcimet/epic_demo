import { list } from '@keystone-6/core'
import { checkbox, select, text } from '@keystone-6/core/fields'

import { TIMESTAMP_SCHEMA } from '../../../constants/schema'

import { getModuleUIArgs, ModuleOpAccessArgs } from '../../../utils/access'
import { LIST_ACCESS_KEY_MAP } from '../../../config/access'
import { MatchEmptyField } from '../../../constants/common'

const OpenEnergyBillRule = list({
  access: {
    ...ModuleOpAccessArgs,
  },
  fields: {
    transactionUType: select({
      validation: { isRequired: true },
      options: [
        { label: 'demand', value: 'demand' },
        { label: 'onceOff', value: 'onceOff' },
        { label: 'otherCharges', value: 'otherCharges' },
        { label: 'payment', value: 'payment' },
        { label: 'usage', value: 'usage' },
      ],
    }),
    value: text({
      validation: {
        isRequired: true,
        match: MatchEmptyField,
      },
      ui: {
        description: 'The value to be matched',
      },
    }),
    isExclusive: checkbox({
      ui: {
        description: 'If checked, this rule will not be calculated',
      },
      defaultValue: false,
    }),
    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.OpenEnergyBillRule),
    hideCreate: true,
  },
  hooks: {
    validateInput: async ({ resolvedData, addValidationError, context, item }) => {
      const transactionUType = resolvedData.transactionUType ?? item?.transactionUType
      const value = (resolvedData.value ?? item?.value)?.trim()
      const id = resolvedData.id ?? item?.id

      const existingRule = await context.db.OpenEnergyBillRule.findMany({
        where: {
          transactionUType: { equals: transactionUType },
          value: { equals: value },
          id: { not: { equals: id } },
        },
      })

      if (existingRule.length) {
        addValidationError('A rule with this combination of transactionUType and value already exists.')
      }
    },
  },
})
export default OpenEnergyBillRule
