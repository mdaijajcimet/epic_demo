import { list } from '@keystone-6/core'
import { calendarDay, float, integer, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import {
  detailsDocTypeField,
  detailsDocValidationHooks,
  efficiencyField,
  expiryDateField,
  LABELS,
} from './utils'

const SolarPanel = list({
  access: ModuleOpAccessArgs,
  fields: {
    manufacturer: relationship({ ref: 'Manufacturer', many: false }),
    modelNumber: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    series: text(),
    solarCellType: text({ label: LABELS.solarCellType }),
    capacity: float({ label: LABELS.solarCapacity }),
    efficiency: efficiencyField(),
    outerDimensions: text({ label: LABELS.outerDimensions }),
    weight: float({ label: LABELS.weight }),
    countryOfManufacturing: text(),
    warranty: integer({ label: LABELS.warranty }),
    warrantyClaims: float({ label: LABELS.warrantyClaims }),
    totalPanels: integer({ label: LABELS.totalPanels }),
    ipRating: float(),
    detailsType: detailsDocTypeField,
    details: text({ label: LABELS.detailsUrl }),
    detailsDoc: relationship({
      ref: 'Media',
      many: false,
      label: LABELS.detailsDoc,
    }),
    approveDate: calendarDay({
      validation: { isRequired: true },
    }),
    expiryDate: expiryDateField,
  },
  hooks: {
    ...detailsDocValidationHooks,
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.SolarPanel),
  },
})

export default SolarPanel
