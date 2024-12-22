import camelCase from 'lodash/camelCase'
import difference from 'lodash/difference'
import uniqBy from 'lodash/uniqBy'
import { SPLIT_WITHOUT_SPACE_REGEX } from '../../constants/common'
import { PrimitiveField, RelField } from '../../types'
import {
  GetConnectionItemParams,
  GetMatchedIdParams,
  ProcessRelFieldsParams,
  VerifyHeaderParams,
} from './types'

export const getUnique = (arr: Array<any>, uniqueKeys: string[]) =>
  uniqueKeys.reduce((acc, key) => uniqBy(acc, key), [...arr])

export const doAdditionalChecks = ({ records, table }: any) => {
  switch (table) {
    case 'IgnoreList': {
      return records.map((record: Record<string, any>) => {
        return record.taggedAs === 'spamData'
          ? {
              ...record,
              type: { connect: [] },
            }
          : record
      })
    }

    default:
      return records
  }
}
export const verifyHeaders = ({
  fileHeaders,
  allFields,
  requiredFields,
}: VerifyHeaderParams):
  | { isSuccessful: true }
  | { isSuccessful: false; missingRequiredFields: string[]; incorrectFields: string[] } => {
  const incorrectFields = difference(fileHeaders, allFields)
  const missingRequiredFields = difference(requiredFields, fileHeaders)

  if (incorrectFields.length || missingRequiredFields.length) {
    return {
      isSuccessful: false,
      incorrectFields,
      missingRequiredFields,
    }
  }
  return { isSuccessful: true }
}
const getMatchedId = ({ item, fieldRelationshipData = {} }: GetMatchedIdParams) => {
  // match with labelField
  const labelFieldItem =
    fieldRelationshipData?.[item] ||
    fieldRelationshipData?.[item.toLowerCase()] ||
    fieldRelationshipData?.[camelCase(item)]
  if (labelFieldItem) return labelFieldItem
  //match with ids
  return Object.values(fieldRelationshipData).includes(item) ? item : ''
}
const getConnectionItem = ({
  fieldMeta,
  fieldInRecord,
  fieldRelationshipData = {},
}: GetConnectionItemParams) => {
  let connect: Array<{ id: string }> | { id: string } | null = null
  // relationshipData.affiliate[record.name] => single value if many: false "Econnex", array. if Many true ["Econnex", "iSelect"]
  const dataInRecord =
    fieldMeta.many && typeof fieldInRecord === 'string'
      ? fieldInRecord.split(SPLIT_WITHOUT_SPACE_REGEX)
      : fieldInRecord

  if (fieldMeta.many) {
    const items: Array<{ id: string }> = []

    dataInRecord.forEach((item: string) => {
      const id = getMatchedId({ item, fieldRelationshipData })

      if (id) items.push({ id })
    })
    connect = items
  } else {
    const id = getMatchedId({ item: dataInRecord, fieldRelationshipData })

    if (id) connect = { id }
  }
  return connect
}
const getRelationshipDataMap = (
  relationshipResponse: Record<string, any>,
  existingRelFields: string[],
  parsedRelationshipFields: Record<string, RelField>,
) =>
  existingRelFields.reduce((dataMap: Record<string, Record<string, string>>, key, index) => {
    const updatedRecords = relationshipResponse[index]?.reduce(
      (updated: Record<string, any>, record: Record<string, any>) => {
        updated[record[parsedRelationshipFields[key].refLabelField]] = record.id
        return updated
      },
      {},
    )
    dataMap[key] = updatedRecords
    return dataMap
  }, {})
export const processRelationshipFields = async ({
  existingRelFields,
  context,
  relationshipFields,
  record,
}: ProcessRelFieldsParams) => {
  const relationshipResponse = await Promise.all(
    existingRelFields.map(
      async (field) =>
        await context.query[relationshipFields[field].refListKey].findMany({
          query: `id, ${relationshipFields[field].refLabelField}`,
        }),
    ),
  )
  const relationshipData = getRelationshipDataMap(relationshipResponse, existingRelFields, relationshipFields)
  return existingRelFields.reduce((updatedRel, field) => {
    const connect = getConnectionItem({
      fieldInRecord: record[field],
      fieldMeta: relationshipFields[field],
      fieldRelationshipData: relationshipData[field],
    })
    return Object.assign(
      { ...updatedRel },
      connect
        ? {
            [field]: {
              connect,
            },
          }
        : {},
    )
  }, {})
}
export const parseBodyData = (body: any) => {
  const { table, primitiveFields, relationshipFields } = body

  let { requiredFields, filterKeys } = body

  if (filterKeys) filterKeys = JSON.parse(filterKeys)
  if (requiredFields) requiredFields = JSON.parse(requiredFields)
  let parsedFields = {} as Record<string, PrimitiveField>
  if (primitiveFields) parsedFields = JSON.parse(primitiveFields)
  let parsedRelationshipFields = {} as Record<string, RelField>
  if (relationshipFields) parsedRelationshipFields = JSON.parse(relationshipFields)

  return {
    table,
    relationshipFields: parsedRelationshipFields,
    filterKeys,
    requiredFields,
    primitiveFields: parsedFields,
  }
}
