import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import commonSpecialFields from '../Common/SpecialFields'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const CCSpecial = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'Special', 'Offer'),
    creditCard: relationship({
      ref: 'CreditCard.specials',
      many: false,
      ui: readOnly({}, 'sidebar'),
    }),
    ...commonSpecialFields,
  },
  ui: {
    label: 'Offer & Specials',
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Special, { hideCreate: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

export default CCSpecial
