import { checkbox, text } from '@keystone-6/core/fields'
import { BaseListTypeInfo, FieldTypeFunc } from '@keystone-6/core/types'
import { FieldConfig } from '../../types'
import { createdAtSchema, updatedAtSchema } from '../Common/common'

export const schemaWithCommonFields = (otherFields: Record<string, FieldTypeFunc<BaseListTypeInfo>>) => ({
  name: text({
    validation: { isRequired: true },
    isIndexed: 'unique',
    hooks: {
      resolveInput: ({ resolvedData }) => resolvedData?.name?.toLowerCase(),
    },
  }),
  status: checkbox({
    ui: {
      createView: { fieldMode: 'hidden' },
      itemView: { fieldPosition: 'sidebar' },
      description: 'Enabled/Disabled?',
    },
    defaultValue: true,
  }),
  ...otherFields,
  comments: text({ ui: { displayMode: 'textarea' } }),
  createdAt: createdAtSchema(),
  updatedAt: updatedAtSchema(),
})

export const assignedDataCountUI: FieldConfig<'ui'> = {
  createView: {
    fieldMode: 'hidden',
  },
  itemView: {
    fieldMode: 'read',
  },
  listView: {
    fieldMode: 'read',
  },
}
