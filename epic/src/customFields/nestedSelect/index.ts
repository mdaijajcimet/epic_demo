import { graphql } from '@keystone-6/core'
import { BaseListTypeInfo, FieldTypeFunc, fieldType, orderDirectionEnum } from '@keystone-6/core/types'
import { NestedSelectConfig } from './types'

export const nestedSelect =
  <ListTypeInfo extends BaseListTypeInfo>({
    options = [],
    defaultIndex = null,
    isDynamic = false,
    filterKey = '',
    isRelationship: { childName = '', linkKey = '', parentName = '' } = {},
    childLabel = '',
    parentType = 'single',
    childType = 'multi',
    hasSubDisabled = false,
    disableDefaultSelection = false,
    ...config
  }: NestedSelectConfig<ListTypeInfo>): FieldTypeFunc<ListTypeInfo> =>
  () =>
    fieldType({
      kind: 'scalar',
      mode: 'optional',
      scalar: 'String',
    })({
      ...config,
      input: {
        create: {
          arg: graphql.arg({ type: graphql.String }),
          resolve(value: string | null | undefined) {
            return value ?? ''
          },
        },
        update: {
          arg: graphql.arg({ type: graphql.String }),
        },
        orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
      },
      output: graphql.field({
        type: graphql.String,
        resolve({ value }) {
          return value ? value : null
        },
      }),
      views: './src/customFields/nestedSelect/views',
      getAdminMeta: () => {
        return {
          options,
          defaultIndex,
          isDynamic,
          filterKey,
          childLabel,
          childName,
          linkKey,
          parentName,
          parentType,
          childType,
          hasSubDisabled,
          disableDefaultSelection,
        }
      },
    })
