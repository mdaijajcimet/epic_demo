import { Context, RelField } from '../../types'

export type VerifyHeaderParams = {
  fileHeaders: string[]
  allFields: string[]
  requiredFields: string[]
}
export type GetMatchedIdParams = {
  item: string
  fieldRelationshipData?: Record<string, string>
}
export type GetConnectionItemParams = {
  fieldMeta: RelField
  fieldInRecord: any
  fieldRelationshipData?: Record<string, string>
}
export type ProcessRelFieldsParams = {
  existingRelFields: string[]
  relationshipFields: Record<string, RelField>
  record: Record<string, any>
  context: Context
}
