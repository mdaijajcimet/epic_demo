import type { CustomFieldsConfig } from '../../types'
import type { AccessModuleInput } from '../../types/access'

type FieldAccessConfig = {
  accessCondition: AccessModuleInput
}

export const FIELD_ACCESS_KEY_MAP: Partial<CustomFieldsConfig<FieldAccessConfig>> = {
  Affiliate: {
    apiKey: {
      accessCondition: 'apiKey',
    },
  },
  CsSite: {
    apiKey: {
      accessCondition: 'apiKey',
    },
  },
  InstallerLicence: {
    number: {
      accessCondition: 'affiliate',
    },
  },
}
