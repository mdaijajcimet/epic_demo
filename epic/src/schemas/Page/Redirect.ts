import { list } from '@keystone-6/core'
import { relationship, select, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { validateMultiRelations } from '../Common/utils/relationshipValidators'
import { getDomainRule } from './utils'

export const Redirect = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      query: (args) => ({ domain: { some: getDomainRule(args) } }),
    },
  },
  fields: {
    domain: relationship({
      ref: 'Domain.redirects',
      many: true,
      ui: {
        labelField: 'hostname',
      },
      hooks: {
        validate(args) {
          if (args.operation === 'delete') return
          return validateMultiRelations<'field'>(args, [args.fieldKey])
        },
      },
    }),
    from: text({ validation: { isRequired: true } }),
    to: text({ validation: { isRequired: true } }),
    type: select({
      validation: { isRequired: true },
      options: [
        { label: '301 - Permanent', value: '301' },
        { label: '302 - Temporary', value: '302' },
      ],
    }),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Redirect),
  },
})
