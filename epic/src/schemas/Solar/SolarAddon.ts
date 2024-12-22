import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { detailsDocTypeField, LABELS, detailsDocValidationHooks } from './utils'

const SolarAddon = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    detailsType: detailsDocTypeField,
    details: text({ label: LABELS.detailsUrl }),
    detailsDoc: relationship({
      ref: 'Media',
      many: false,
      label: LABELS.detailsDoc,
    }),
    features: relationship({ ref: 'AddonFeature', many: true, ui: { labelField: 'description' } }),
  },
  hooks: {
    ...detailsDocValidationHooks,
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.SolarAddon),
  },
})

export default SolarAddon
