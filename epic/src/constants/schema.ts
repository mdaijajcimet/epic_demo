import { createdAtSchema, updatedAtSchema } from '../schemas/Common/common'

export const TIMESTAMP_SCHEMA = {
  createdAt: createdAtSchema(),
  updatedAt: updatedAtSchema(),
}

export const FORM_OPTION_KEYS = {
  COUNTRY_LIST: 'country-list',
  EMP_ELIGIBILITY_TYPES: 'employment-eligibility-types',

  GENERIC_LOGO: 'generic-logo-key',
  GENERIC_INPUT_TYPE: 'generic-input-type',
  GENERIC_FORMATTER: 'generic-formatter',

  PL_LOAN_PURPOSE_DETAIL: 'pl-loan-purpose-detail',

  CC_UPLOAD_GROUP: `credit-cards-upload-group`,
  UPLOAD_CATEGORY: 'upload-category',
  UPLOAD_DOCUMENT: 'upload-document',
}
