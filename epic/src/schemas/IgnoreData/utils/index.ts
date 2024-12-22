import { BaseListTypeInfo, FieldUpdateItemAccessArgs } from '@keystone-6/core/types'
export { updateMany, updateTypeInParamTable } from './graphqlUtils'
export const accessForRelationshipField = (allowRemoval = true) => ({
  create: () => false,
  update: ({ inputData, fieldKey }: FieldUpdateItemAccessArgs<BaseListTypeInfo>) =>
    inputData[fieldKey]?.connect || !allowRemoval ? false : true,
})
