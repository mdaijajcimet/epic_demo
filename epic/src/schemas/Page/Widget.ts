import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { componentBlocks } from '../../componentBlocks/WidgetComponentBlocks'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { addIdsToObjectArrays } from '../../utils/addIdsToObjectArrays'
import { slugSchema } from '../Common/common'

export const Widget = list({
  access: ModuleOpAccessArgs,
  fields: {
    title: text({
      validation: { isRequired: true },
      hooks: {
        resolveInput: ({ resolvedData }) => {
          return resolvedData?.title?.trim()
        },
      },
    }),
    slug: slugSchema('title'),

    content: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
      ui: {
        views: path.join(process.cwd(), './src/componentBlocks/WidgetComponentBlocks'),
      },
      componentBlocks,
    }),

    pages: relationship({ ref: 'Page.widgets', many: true }),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
    resolveInput: ({ resolvedData, operation }) => {
      if (['create', 'update'].includes(operation)) {
        const modifiedData = {
          ...resolvedData,
          content: resolvedData?.content?.map((item: any) => {
            if (item.type === 'component-block') {
              const modifiedComponentBlock = { ...item }
              modifiedComponentBlock.props = addIdsToObjectArrays(item.props)
              return modifiedComponentBlock
            }
            return item
          }),
        }
        return modifiedData
      }
      return resolvedData
    },
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Widget),
  },
})
