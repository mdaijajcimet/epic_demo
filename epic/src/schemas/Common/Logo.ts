import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { nestedSelect } from '../../customFields/nestedSelect'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { validateSingleRelations } from './utils/relationshipValidators'
import { getFormOptionKeyDesc } from '../../utils/schemas'
import { FORM_OPTION_KEYS } from '../../constants/schema'

const Logo = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    key: nestedSelect({
      label: 'Options',
      options: [],
      isDynamic: true,
      childType: 'single',
      filterKey: FORM_OPTION_KEYS.GENERIC_LOGO,
      ui: { description: getFormOptionKeyDesc(FORM_OPTION_KEYS.GENERIC_LOGO) },
    }),
    media: relationship({
      ref: 'Media',
      many: false,
      hooks: {
        validateInput: (data) => validateSingleRelations<'field'>(data, ['media']),
      },
    }),
  },
  ui: {
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Logo),
  },
  hooks: {
    afterOperation: (data) => registerAuditLog(data),
  },
})

export default Logo
