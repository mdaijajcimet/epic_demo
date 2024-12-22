import { graphql, list } from '@keystone-6/core'
import { checkbox, integer, relationship, text, virtual } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

export const Plan = list({
  access: ModuleOpAccessArgs,
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item) {
          return item?.name + ` (${item?.planId})`
        },
      }),
    }),
    uuid: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: readOnly(),
    }),
    planId: integer({
      validation: { isRequired: true },
      ui: readOnly(),
    }),
    name: text({ ui: readOnly() }),
    planStatus: checkbox({ ui: readOnly({}, 'sidebar') }),
    scripts: relationship({ ref: 'Script.plans', many: true }),
    provider: relationship({ ref: 'Provider.plans', many: false, ui: readOnly({}, 'sidebar') }),
    addons: relationship({ ref: 'Addon.plans', many: true, ui: readOnly() }),
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    labelField: 'label',
    label: 'LMS Plan',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Plan, { hideCreate: true, hideDelete: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})
