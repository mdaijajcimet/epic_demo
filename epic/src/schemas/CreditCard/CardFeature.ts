import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const CardFeature = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('creditCard', 'CardFeature', 'Feature'),
    name: text({ validation: { isRequired: true } }),
    creditCard: relationship({ ref: 'CreditCard.cardFeatures', many: false, ui: readOnly({}, 'sidebar') }),
    description: text({ ui: { displayMode: 'textarea' }, validation: { isRequired: true } }),
  },
  ui: {
    label: 'Plan Features',
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CardFeature, { hideCreate: true }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

export default CardFeature
