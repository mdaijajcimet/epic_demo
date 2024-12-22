import { list } from '@keystone-6/core'
import { checkbox, relationship, select, text } from '@keystone-6/core/fields'

import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { ignoreListHooks } from './hooks/list'

const IgnoreList = list({
  access: ModuleOpAccessArgs,
  fields: {
    parameter: relationship({
      ref: 'IgnoreParameter',
      ui: { labelField: 'name', hideCreate: true },
    }),
    parameterData: relationship({
      ref: 'IgnoreDataContent',
      ui: {
        labelField: 'text',
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'hidden',
        },
        listView: {
          fieldMode: 'hidden',
        },
      },
    }),
    parameterContent: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    status: checkbox({
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldPosition: 'sidebar' },
        description: 'Enabled/Disabled?',
      },
      defaultValue: true,
    }),
    taggedAs: select({
      type: 'enum',
      validation: { isRequired: true },
      ui: { displayMode: 'radio', itemView: { fieldPosition: 'sidebar' } },
      options: [
        {
          label: 'Test',
          value: 'testData',
        },
        {
          label: 'Spam',
          value: 'spamData',
        },
      ],
    }),
    type: relationship({
      ref: 'IgnoreType',
      ui: { labelField: 'name', hideCreate: true },
      many: true,
      hooks: ignoreListHooks.fields?.type,
    }),
    comments: text({ ui: { displayMode: 'textarea' } }),
  },
  ui: {
    listView: {
      initialColumns: ['parameterContent', 'parameter', 'type', 'taggedAs'],
    },
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.IgnoreList),
  },
  hooks: ignoreListHooks.list,
})

export default IgnoreList
