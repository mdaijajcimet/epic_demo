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

const Inverter = list({
  access: ModuleOpAccessArgs,
  fields: {
    manufacturer: relationship({ ref: 'Manufacturer', many: false }),
    modelNumber: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    series: text({ validation: { isRequired: true } }),
    type: text({ label: LABELS.inverterType }),
    powerRating: float({ label: LABELS.powerRating }),
    maxEfficiency: efficiencyField('maxEfficiency'),
    outerDimensions: text({ label: LABELS.outerDimensions }),
    weight: float({ label: LABELS.weight }),
    countryOfManufacturing: text(),
    warranty: integer({ label: LABELS.warranty }),
    warrantyClaims: float({ label: LABELS.warrantyClaims }),
    totalMPPT: integer({ label: LABELS.totalMPPT }),
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
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Inverter),
  },
})

export default Inverter
