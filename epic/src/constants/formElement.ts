export const MIN_MAX_DESCRIPTION =
  'Note: Date should be in dd/mm/yyyy format and for others integer must be added'

const FORM_VALIDATION_SCHEMA_TYPES = {
  string: ['string', 'name', 'email', 'numeric', 'alphaNumeric', 'mobile'],
  date: ['date', 'dob', 'pastDate', 'futureDate'],
  number: ['number'],
}
export const FORM_VALIDATION_SCHEMA_TYPES_MAP = Object.entries(FORM_VALIDATION_SCHEMA_TYPES).reduce(
  (acc: Record<string, string>, [schemaType, data]) => {
    data.forEach((type) => {
      acc[type] = schemaType
    })
    return acc
  },
  {},
)
