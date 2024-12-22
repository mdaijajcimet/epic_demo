import { BaseFields, graphql, group } from '@keystone-6/core'
import {
  checkbox,
  integer,
  json,
  relationship,
  select,
  text,
  timestamp,
  virtual,
} from '@keystone-6/core/fields'
import { BaseListTypeInfo } from '@keystone-6/core/types'
import { nanoid } from 'nanoid'
import path from 'path'

import buildSlug from '../../libs/buildSlug'
import { readOnly } from '../../utils'

export const createdAtSchema = () => {
  return timestamp({
    defaultValue: { kind: 'now' },
    ui: readOnly({}, 'sidebar'),
  })
}

export const updatedAtSchema = () => {
  return timestamp({
    defaultValue: { kind: 'now' },
    db: { updatedAt: true },
    ui: readOnly({}, 'sidebar'),
  })
}

export const slugSchema = (key = 'name') => {
  return text({
    isIndexed: 'unique',
    hooks: {
      resolveInput: ({ operation, resolvedData, inputData }) => {
        if (operation === 'create' && !inputData.slug) {
          return key && key in inputData && inputData[key] ? buildSlug(inputData[key]) : ''
        }

        return resolvedData?.slug
      },
    },
    ui: {
      itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
      listView: { fieldMode: 'read' },
    },
  })
}

export const statusSchema = (label: string, defaultValue = true, readOnly = false) => {
  return checkbox({
    ui: {
      createView: { fieldMode: 'hidden' },
      itemView: readOnly ? { fieldPosition: 'sidebar', fieldMode: 'read' } : { fieldPosition: 'sidebar' },
    },
    defaultValue,
    label,
  })
}

export const formCompUtilityFields = {
  tooltip: text(),
  infoText: text({
    label: 'Info',
    ui: { displayMode: 'textarea' },
  }),
  infoPosition: select({
    options: [
      { label: 'Top', value: 'top' },
      { label: 'Bottom', value: 'bottom' },
    ],
    ui: { displayMode: 'segmented-control' },
    defaultValue: 'bottom',
  }),
}

export const affiliatesSchemaFields = (mappedField: string) => ({
  hasAllAffiliates: checkbox({
    label: 'Include All Affiliates',
    ui: {
      description: 'If checked, affiliate will be auto added once clicked on save changes',
      itemView: { fieldPosition: 'sidebar' },
    },
    defaultValue: false,
  }),

  ...group({
    label: '[ Section ] - Affiliate / SubAffiliate',
    fields: {
      affiliate: relationship({
        ref: `Affiliate.${mappedField}`,
        many: true,
        ui: { description: 'Assign Affiliates', hideCreate: true },
      }),
      includeAllSubAff: checkbox({
        defaultValue: true,
        label: 'Include Affiliate SubAffiliates',
        ui: {
          description: 'If checked, all subaffiliates of current selection(not existing) got mapped',
          views: path.join(process.cwd(), './src/customFields/Checkbox/hideView'),
        },
      }),
      subAffiliate: relationship({
        ref: `SubAffiliate.${mappedField}`,
        many: true,
        ui: { description: 'Assign SubAffiliates', hideCreate: true },
      }),
    },
  }),
})

export const verticalProductCommonFields = ({
  providerRef,
  providerMode,
}: {
  providerRef: string
  providerMode?: 'edit' | 'read' | 'hidden'
}): BaseFields<BaseListTypeInfo> => ({
  ...planVirtualField(),
  isDiscontinued: checkbox({
    defaultValue: false,
    ui: {
      createView: {
        fieldMode: 'hidden',
      },
      itemView: {
        fieldPosition: 'sidebar',
      },
    },
  }),
  name: text({ validation: { isRequired: true } }),
  description: text(),
  uuid: text({
    isIndexed: 'unique',
    hooks: {
      resolveInput: ({ operation, resolvedData, inputData }) => {
        if (operation === 'create' && !inputData.uuid) {
          return nanoid()
        }
        return resolvedData?.uuid
      },
    },
    ui: {
      createView: { fieldMode: 'hidden' },
      itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
      listView: { fieldMode: 'read' },
    },
  }),
  slug: text({
    hooks: {
      resolveInput: ({ operation, resolvedData, inputData }) => {
        if (operation === 'create' && !inputData.slug) {
          return buildSlug(inputData.name)
        }

        return resolvedData?.slug
      },
    },
    ui: {
      createView: { fieldMode: 'hidden' },
      itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
      listView: { fieldMode: 'read' },
    },
  }),
  image: relationship({ ref: 'Media', many: false }),
  provider: relationship({
    ref: providerRef,
    many: false,
    ui: {
      hideCreate: true,
      itemView: {
        fieldPosition: 'sidebar',
        fieldMode: providerMode ?? 'edit',
      },
    },
    hooks: {
      validateInput: async ({ operation, resolvedData, item, addValidationError, context, listKey }) => {
        let { provider, name } = resolvedData
        if (!name) {
          name = item?.name
        }
        if (!provider && operation === 'update') {
          provider = item?.providerId
        } else {
          provider = provider?.connect.id
        }
        if (provider) {
          const count = await context.query[listKey].count({
            where: { name: { equals: name }, provider: { id: { equals: provider } } },
          })
          if (
            (operation === 'create' && count) ||
            (operation === 'update' &&
              (((resolvedData.name || resolvedData.provider) && count) || count === 2))
          ) {
            addValidationError('Violating unique constraint: provider and name')
          }
        }
      },
    },
  }),
})

export const selectSchema = ({
  label,
  options = [],
  defaultValue,
  displayMode = 'radio',
  isRequired = true,
}: {
  options: { label: string; value: string }[]
  defaultValue: string | undefined
  label: string
  isRequired?: boolean
  displayMode?: 'segmented-control' | 'select' | 'radio'
}) => {
  return select({
    label,
    options,
    ui: { displayMode, itemView: { fieldPosition: 'sidebar' } },
    defaultValue,
    validation: { isRequired },
  })
}

export const providerVirtualField = () => ({
  label: virtual({
    field: graphql.field({
      type: graphql.String,
      async resolve(item: Record<string, unknown>, _args, context) {
        let providerName = item?.id?.toString() ?? ''
        if (item?.providerId) {
          const provider = await context.query?.Provider.findOne({
            where: {
              id: item?.providerId?.toString(),
            },
            query: 'name',
          })
          providerName = provider?.name
        }
        return providerName + `${!item?.status ? ' [ DISABLED ]' : ''}`
      },
    }),
  }),
})

export const planVirtualField = () => ({
  label: virtual({
    field: graphql.field({
      type: graphql.String,
      async resolve(item: Record<string, unknown>) {
        return item?.name + `${item?.isDiscontinued ? ' [ DISABLED ]' : ''}`
      },
    }),
  }),
})

export const commonProviderSchemaFields = () => ({
  status: statusSchema('Enable / Disable Provider'),
  slug: slugSchema(),
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
      itemView: { fieldMode: 'read', fieldPosition: 'sidebar' },
      listView: { fieldMode: 'read' },
    },
  }),
  ...group({
    label: '[ Section ] - Basic Information',
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      logo: relationship({ ref: 'Media', many: false }),
      postSubmissionContent: text({
        ui: { displayMode: 'textarea', description: 'Content in Submission Page' },
      }),
      australianCreditLicence: integer(),
    },
  }),
})

/**
 * @param providerKey - Provider list key should start with capitalLetter
 * @param containerKey - Container list key should start with smallLetter
 * @param scriptKey - Script list key should start with smallLetter
 */

export const commonFormContainerFields = (providerKey: string, containerKey: string, scriptKey?: string) => ({
  label: text({ validation: { isRequired: true } }),
  ...(providerKey
    ? {
        provider: relationship({
          ref: `${providerKey}.formContainer`,
          many: true,
        }),
      }
    : {}),
  isDefault: checkbox({
    label: 'Is Default',
    defaultValue: false,
    ui: { itemView: { fieldPosition: 'sidebar' } },
  }),
  v2: checkbox({
    label: 'v2 Journey',
    defaultValue: false,
    ui: { itemView: { fieldPosition: 'sidebar' } },
  }),
  ...affiliatesSchemaFields(containerKey),
  page: text({ validation: { isRequired: true } }),
  formComponents: relationship({
    ref: 'FormComponent',
    many: true,
    ui: { displayMode: 'select', labelField: 'name' },
  }),
  formOrder: json({ defaultValue: [] }),
  defaultProps: json({ defaultValue: {} }),
  staticData: json({
    ui: {
      views: path.join(process.cwd(), './src/customFields/formContainerStaticData'),
    },
    label: 'Static Data',
  }),
  ...(scriptKey ? { scripts: relationship({ ref: `Script.${scriptKey}`, many: true }) } : {}),
})
