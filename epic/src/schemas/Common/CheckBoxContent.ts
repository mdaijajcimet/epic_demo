import { list } from '@keystone-6/core'
import { integer, select, text } from '@keystone-6/core/fields'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { createdAtSchema, updatedAtSchema } from './common'

const CheckBoxContent = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    type: select({
      label: 'Checkbox Type',
      options: [
        { label: 'Required', value: 'required' },
        { label: 'Optional', value: 'optional' },
      ],
      defaultValue: 'required',
    }),
    order: integer(),
    content: text({ ui: { views: path.join(process.cwd(), './src/customFields/CustomEditor') } }),
    validationMessage: text(),
    createdAt: createdAtSchema(),
    updatedAt: updatedAtSchema(),
  },
  ui: {
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CheckBoxContent),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
})

export default CheckBoxContent
