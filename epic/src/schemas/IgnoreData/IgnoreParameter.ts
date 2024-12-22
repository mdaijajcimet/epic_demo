import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { relationshipCountField } from '../../utils/relationshipCountField'
import { assignedDataCountUI, schemaWithCommonFields } from './commonSchema'
import { paramHooks } from './hooks/param'
import { accessForRelationshipField } from './utils'

const IgnoreParameter = list({
  access: ModuleOpAccessArgs,
  fields: schemaWithCommonFields({
    assignedDataCount: relationshipCountField({
      list: 'IgnoreParameter',
      field: 'typeData',
      additionalParams: {
        ui: assignedDataCountUI,
      },
    }),
    type: relationship({
      ref: 'IgnoreType.parameter',
      many: true,
      ui: {
        labelField: 'name',
        createView: { fieldMode: 'hidden' },
        hideCreate: true,
        itemView: { fieldMode: 'read' },
      },
      access: accessForRelationshipField(false),
    }),
    typeData: relationship({
      ref: 'IgnoreDataContent',
      many: true,
      ui: { labelField: 'text', createView: { fieldMode: 'hidden' }, hideCreate: true },
      access: accessForRelationshipField(),
      hooks: paramHooks.fields?.typeData,
    }),
  }),
  ui: {
    listView: {
      initialColumns: ['name', 'assignedDataCount', 'comments', 'updatedAt'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.IgnoreParameter),
  },
  hooks: paramHooks.list,
})

export default IgnoreParameter
