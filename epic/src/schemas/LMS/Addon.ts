import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { graphql, list } from '@keystone-6/core'
import { text, relationship, integer, select, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

export const Addon = list({
  access: ModuleOpAccessArgs,
  fields: {
    uuid: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: { itemView: { fieldMode: 'hidden' } },
    }),
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, unknown>, _args, context) {
          let addonField
          if (item?.addonFieldsId) {
            addonField = await context.query?.AddonField.findOne({
              where: {
                id: item?.addonFieldsId?.toString(),
              },
              query: 'addonName addonId',
            })
          }
          return `${addonField?.addonName} 
            (${addonField?.addonId}) 
            (${item?.addonGroup}) 
            (${item?.include}-${item?.isMandatory})`
        },
      }),
    }),
    addonFields: relationship({ ref: 'AddonField.addons', many: false, ui: readOnly({}, 'sidebar') }),
    addonGroup: select({
      label: 'Addon Group',
      options: [
        { label: 'Home Connection', value: 'home_connection' },
        { label: 'Plan Addons Modem', value: 'plan_addons_modem' },
        { label: 'Plan Other Addons', value: 'plan_other_addons' },
      ],
      ui: readOnly({}, 'sidebar'),
    }),
    price: text({ ui: readOnly() }),
    isMandatory: integer({ ui: readOnly({}, 'sidebar') }),
    include: integer({ ui: readOnly({}, 'sidebar') }),
    plans: relationship({ ref: 'Plan.addons', many: true, ui: readOnly() }),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    labelField: 'label',
    label: 'LMS Addon',
    listView: {
      initialColumns: ['label', 'addonGroup', 'price'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Addon, { hideCreate: true, hideDelete: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

export const AddonField = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item) {
          return item?.addonName + ` (${item?.addonId})`
        },
      }),
    }),
    addonId: integer({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: readOnly(),
    }),
    addonName: text({ ui: readOnly() }),
    category: integer({ ui: readOnly() }),
    addons: relationship({ ref: 'Addon.addonFields', many: true, ui: readOnly({ labelField: 'uuid' }) }),
    scripts: relationship({ ref: 'Script.addonFields', many: true }),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    labelField: 'label',
    label: 'LMS AddonField',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Addon, { hideCreate: true, hideDelete: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
