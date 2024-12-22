import { list } from '@keystone-6/core'
import { json, relationship, select, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { createdAtSchema, updatedAtSchema } from '../Common/common'

const FormComponent = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    key: text({ validation: { isRequired: true } }),
    label: text(),
    type: select({
      options: [
        { label: 'Main Component', value: 'main' },
        { label: 'Sub Component', value: 'sub' },
      ],
      ui: { displayMode: 'segmented-control' },
      defaultValue: 'main',
    }),
    tooltip: text(),
    fields: relationship({ ref: 'FormField', many: true, ui: { displayMode: 'select', labelField: 'name' } }),
    formGroups: json({ defaultValue: [], label: 'Form Groups (Fields Layout)' }),
    defaultProps: json({ defaultValue: {} }),
    scripts: relationship({ ref: 'Script.formComponents', many: true }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  hooks: {
    afterOperation: async (data) => {
      await registerAuditLog(data)
    },
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.FormComponent),
  },
})

export default FormComponent
