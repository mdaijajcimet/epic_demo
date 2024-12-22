import { list } from '@keystone-6/core'
import { json, relationship, select, text } from '@keystone-6/core/fields'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { formOptions, uiComponents } from '../../constants/selectOptions'
import { nestedSelect } from '../../customFields/nestedSelect'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { createdAtSchema, formCompUtilityFields, updatedAtSchema } from '../Common/common'

const FormField = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    label: text(),
    key: text({
      validation: { isRequired: true },
    }),
    reviewDetailsLabel: text({
      ui: { description: 'If excluded then Field key added in form Groups will be considered' },
    }),
    placeholder: text(),
    component: select({
      options: uiComponents,
      ui: { displayMode: 'select' },
    }),
    ...formCompUtilityFields,
    options: nestedSelect({
      label: 'Options',
      options: formOptions,
      isDynamic: true,
      disableDefaultSelection: true,
    }),
    validations: relationship({ ref: 'FormValidation.formField', many: false, ui: { labelField: 'name' } }),
    subComponents: relationship({
      ref: 'FormComponent',
      many: true,
      ui: { displayMode: 'select', labelField: 'name' },
    }),
    defaultProps: json({ defaultValue: {} }),
    scripts: relationship({ ref: 'Script.formFields', many: true }),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
    content: text({
      ui: { views: path.join(process.cwd(), './src/customFields/CustomEditor') },
    }),
  },
  hooks: {
    afterOperation: async (data) => {
      await registerAuditLog(data)
    },
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.FormField),
  },
})

export default FormField
