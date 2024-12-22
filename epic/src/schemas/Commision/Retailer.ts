import { list } from '@keystone-6/core'
import { relationship, select, text, timestamp } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { energyType, moveIn, propertyType, saleType, states } from '../../constants/selectOptions'
import { customDecimal } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs, rules } from '../../utils/access'

const RetailerMatrix = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: { query: rules.filterVerticalRelatedData },
  },
  fields: {
    retailer: relationship({ ref: 'Provider', many: false }),
    vertical: relationship({ ref: 'Vertical', many: false }),
    propertyType: select({
      label: 'Property Type',
      options: propertyType,
    }),
    saleType: select({
      label: 'Type of Sale',
      options: saleType,
    }),
    energyType: select({
      label: 'Energy Type',
      options: energyType,
    }),
    state: select({
      label: 'States',
      options: states,
    }),
    range: text(),
    moveIn: select({
      options: moveIn,
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    plan: relationship({ ref: 'Plan', many: false }),
    cost: customDecimal({ label: 'Commision Cost ($)' }, { isRequired: true }),
    image: relationship({
      ref: 'Media',
      many: false,
    }),
    startDate: timestamp({ validation: { isRequired: true } }),
    endDate: timestamp(),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => {
      await registerAuditLog(data)
    },
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.RetailerMatrix),
  },
})

export default RetailerMatrix
