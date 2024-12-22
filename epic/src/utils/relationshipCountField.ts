import { graphql } from '@keystone-6/core'
import { VirtualFieldConfig, virtual } from '@keystone-6/core/fields'
import { BaseListTypeInfo } from '@keystone-6/core/types'

export const relationshipCountField = ({
  list = '',
  field = '',
  additionalParams = {},
  args = {},
}: {
  list: string
  field: string
  additionalParams?: Omit<VirtualFieldConfig<BaseListTypeInfo>, 'field'>
  args?: Record<string, any>
}) =>
  virtual({
    ...additionalParams,
    field: graphql.field({
      type: graphql.Int,
      args,
      async resolve(item: Record<string, any>, _args, context) {
        const fieldName = `${field}Count`
        const { [fieldName]: count = 0 }: Record<string, any> = await context.query[list].findOne({
          where: {
            id: item?.id?.toString(),
          },
          query: fieldName,
        })
        return count
      },
    }),
  })
