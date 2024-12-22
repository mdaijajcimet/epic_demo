import { list } from '@keystone-6/core'
import { calendarDay, decimal, float, integer, relationship, text } from '@keystone-6/core/fields'

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

const Battery = list({
  access: ModuleOpAccessArgs,
  fields: {
    manufacturer: relationship({ ref: 'Manufacturer', many: false }),
    modelNumber: text({ validation: { isRequired: true } }),
    series: text({ validation: { isRequired: true } }),
    type: text({ label: LABELS.batteryType }),
    cost: decimal({
      precision: 4,
      scale: 2,
      label: LABELS.cost,
      // Hook to show valid message...Else no clear message is shown
      hooks: {
        validateInput: ({ resolvedData, fieldKey, addValidationError }) => {
          const re = /^\d{2}\.\d{2}$/
          if (resolvedData[fieldKey] && !re.test(resolvedData[fieldKey].toFixed(2))) {
            addValidationError('Cost must have precision of 4 and scale 2')
          }
        },
      },
    }),
    efficiency: efficiencyField(),
    outerDimensions: text({ label: LABELS.outerDimensions }),
    weight: float({ label: LABELS.weight }),
    countryOfManufacturing: text(),
    warranty: integer({ label: LABELS.warranty }),
    warrantyClaims: float({ label: LABELS.warrantyClaims }),
    powerRating: float({ label: LABELS.powerRating }),
    size: float({ label: LABELS.batterySize }),
    roundtripEfficiency: efficiencyField('roundtripEfficiency'),
    lifetime: text({ label: LABELS.batteryLifetime }),
    mount: text(),
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
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Battery),
  },
})

export default Battery
