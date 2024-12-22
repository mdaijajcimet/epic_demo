import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { relationshipCountField } from '../../utils/relationshipCountField'
import { assignedDataCountUI, schemaWithCommonFields } from './commonSchema'
import { typeHooks } from './hooks/type'
import { accessForRelationshipField } from './utils'

const IgnoreType = list({
  access: ModuleOpAccessArgs,

  fields: schemaWithCommonFields({
    assignedDataCount: relationshipCountField({
      list: 'IgnoreType',
      field: 'parameterData',
      additionalParams: {
        ui: assignedDataCountUI,
      },
    }),
    parameter: relationship({
      ref: 'IgnoreParameter.type',
      many: true,
      ui: {
        labelField: 'name',
        createView: { fieldMode: 'hidden' },
        hideCreate: true,
        itemView: { fieldMode: 'read' },
      },
      access: accessForRelationshipField(false),
    }),
    parameterData: relationship({
      ref: 'IgnoreDataContent',
      many: true,
      ui: {
        labelField: 'text',
        createView: { fieldMode: 'hidden' },
        hideCreate: true,
        description: 'Removal is skipped for spam data',
      },
      access: accessForRelationshipField(),
      hooks: typeHooks.fields?.parameterData,
    }),
  }),
  ui: {
    listView: {
      initialColumns: ['name', 'assignedDataCount', 'comments', 'updatedAt'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.IgnoreType),
  },
  hooks: typeHooks.list,
})

export default IgnoreType
