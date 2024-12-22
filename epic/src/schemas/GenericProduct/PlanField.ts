import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import { text } from '@keystone-6/core/fields'
import path from 'path'

import { createdAtSchema, statusSchema, updatedAtSchema } from '../Common/common'
import registerAuditLog from '../../../registerAuditLog'
import { nestedSelect } from '../../customFields/nestedSelect'
import { getFormOptionKeyDesc } from '../../utils/schemas'
import { FORM_OPTION_KEYS } from '../../constants/schema'

const GenericPlanField = list({
  access: allowAll,
  fields: {
    name: text({
      validation: { isRequired: true },
      ui: { description: 'This name is for Epic only. It will show up on all relationships.' },
    }),
    label: text(),
    key: text(),
    type: nestedSelect({
      label: 'Input Type',
      options: [],
      isDynamic: true,
      childType: 'single',
      filterKey: FORM_OPTION_KEYS.GENERIC_INPUT_TYPE,
      ui: { description: getFormOptionKeyDesc(FORM_OPTION_KEYS.GENERIC_INPUT_TYPE) },
    }),
    value: text(),
    formatter: nestedSelect({
      label: 'Formatter',
      options: [],
      isDynamic: true,
      childType: 'single',
      filterKey: FORM_OPTION_KEYS.GENERIC_FORMATTER,
      ui: { description: getFormOptionKeyDesc(FORM_OPTION_KEYS.GENERIC_FORMATTER) },
    }),
    suffix: text(),
    tooltip: text(),
    content: text({
      ui: { views: path.join(process.cwd(), './src/customFields/CustomEditor') },
    }),
    hasListing: statusSchema('Include in Plan Listing'),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  ui: {
    labelField: 'name',
    isHidden: true,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

export default GenericPlanField
