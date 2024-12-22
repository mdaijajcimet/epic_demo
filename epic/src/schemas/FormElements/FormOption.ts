import { list } from '@keystone-6/core'
import { text, json } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const FormOption = list({
  access: ModuleOpAccessArgs,
  fields: {
    key: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
      },
    }),
    label: text({ validation: { isRequired: true } }),
    options: json({ defaultValue: [{ label: 'LABEL', value: 'VALUE' }] }),
  },
  hooks: {
    afterOperation: async (data) => {
      await registerAuditLog(data)
    },
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.FormOption),
  },
})

export default FormOption
