import { graphql, list } from '@keystone-6/core'
import { integer, relationship, text, virtual } from '@keystone-6/core/fields'
import { nanoid } from 'nanoid'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { slugSchema } from '../Common/common'

export const Provider = list({
  access: {
    ...ModuleOpAccessArgs,
    filter: {
      // TODO: uncomment when we get vertical from LMS
      // query: (args) => ({
      //   vertical: isSuperUser(args) ? {} : { some: { slug: { in: getAllowedVerticals(args) } } },
      // }),
    },
  },
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item: Record<string, unknown>) {
          return item?.name + ` (${item?.providerId})`
        },
      }),
    }),
    providerId: text({
      isIndexed: 'unique',
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.providerId) {
            return nanoid()
          }
          return resolvedData?.providerId
        },
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
      },
    }),
    name: text({ validation: { isRequired: true } }),
    slug: slugSchema(),
    // TODO: Once LMS API gives vertical, we will make it mandatory
    vertical: relationship({
      ref: 'Vertical',
      many: true,
      ui: {
        itemView: { fieldPosition: 'sidebar' },
        hideCreate: true,
      },
    }),
    scripts: relationship({ ref: 'Script.providers', many: true }),
    plans: relationship({ ref: 'Plan.provider', many: true, ui: readOnly() }),
    logo: relationship({ ref: 'Media', many: false }),
    postSubmissionContent: text({
      ui: { displayMode: 'textarea', description: 'Content in Submission Page' },
    }),
    australianCreditLicence: integer(),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    validate: async ({ operation, resolvedData, addValidationError, context }) => {
      if (operation === 'delete') return

      const { slug } = resolvedData
      const count = await context.query.Provider.count({
        where: { slug: { equals: slug } },
      })
      if (operation === 'create' && count) {
        addValidationError('Violating unique constraint: slug')
      }
    },
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    labelField: 'label',
    label: 'LMS Provider',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Provider, { hideCreate: true, hideDelete: true }),
  },
})
