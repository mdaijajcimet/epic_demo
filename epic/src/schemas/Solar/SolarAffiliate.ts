import { list } from '@keystone-6/core'
import { decimal, relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const SolarAffiliate = list({
  access: ModuleOpAccessArgs,
  fields: {
    capacityRangeDiff: decimal({
      validation: { isRequired: true, min: '0', max: '99.99' },
      precision: 4,
      scale: 2,
      defaultValue: '0',
      label: 'Capacity Range Difference',
      ui: {
        description:
          'The difference between the selected min and max bundle capacity values on initial load (plans page)',
      },
    }),
    affiliate: relationship({
      ref: 'Affiliate',
      many: false,
      label: 'Affiliate',
      ui: {
        description: 'Related Affiliate',
        hideCreate: true,
      },
      hooks: {
        validateInput: async ({ addValidationError, resolvedData, context, operation }) => {
          if (
            (operation === 'create' && !resolvedData.affiliate) ||
            (operation === 'update' && resolvedData.affiliate?.disconnect && !resolvedData.affiliate?.connect)
          ) {
            addValidationError('affiliate is required')
            return
          }

          if (resolvedData.affiliate?.connect?.id) {
            const count = await context.query.SolarAffiliate.count({
              where: {
                affiliate: {
                  id: {
                    equals: resolvedData.affiliate?.connect?.id,
                  },
                },
              },
            })

            if (count) addValidationError('A SolarAffiliate for this Affiliate already exists')
          }
        },
      },
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.SolarAffiliate),
  },
})

export default SolarAffiliate
