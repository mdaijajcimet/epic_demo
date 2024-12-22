import { calendarDay, float, select, text } from '@keystone-6/core/fields'
import { BaseListTypeInfo, ListHooks } from '@keystone-6/core/types'
import isUndefined from 'lodash/isUndefined'
import upperFirst from 'lodash/upperFirst'
import registerAuditLog from '../../../registerAuditLog'
import { getSchemaValue } from '../../utils/schemas'

export const MEASUREMENT_UNITS = {
  cost: '$',
  efficiency: '%',
  outerDimensions: 'mm x mm x mm',
  weight: 'Kg',
  warranty: 'Years',
  warrantyClaims: '%',
  powerRating: 'Kw',
  batterySize: 'Ah',
  solarCapacity: 'Watt',
  batteryLifetime: 'Years',
  pvBundleAreaNeeded: 'Square meters',
  number: 'Nos',
}

export const LABELS: Record<string, string> = {
  cost: `Cost (${MEASUREMENT_UNITS.cost})`,
  efficiency: `Efficiency (${MEASUREMENT_UNITS.efficiency})`,
  outerDimensions: `Dimensions (L x B x H) (${MEASUREMENT_UNITS.outerDimensions})`,
  weight: `Weight/Unit (${MEASUREMENT_UNITS.weight})`,
  warranty: `Warranty (${MEASUREMENT_UNITS.warranty})`,
  warrantyClaims: `Warranty claims/year (${MEASUREMENT_UNITS.warrantyClaims})`,
  powerRating: `Capacity (${MEASUREMENT_UNITS.powerRating})`,
  roundtripEfficiency: `Roundtrip Efficiency (${MEASUREMENT_UNITS.efficiency})`,
  maxEfficiency: `Max Effciency (${MEASUREMENT_UNITS.efficiency})`,
  batterySize: `Size (${MEASUREMENT_UNITS.batterySize})`,
  solarCapacity: `Rated Maximum power (Pmax) (${MEASUREMENT_UNITS.solarCapacity})`,
  batteryLifetime: `Lifetime (${MEASUREMENT_UNITS.batteryLifetime})`,
  totalCost: `Total Cost (${MEASUREMENT_UNITS.cost})`,
  stcRebate: `Stc Rebate (${MEASUREMENT_UNITS.cost})`,
  pvBundleCapacity: `Capacity`,
  pvBundleAreaNeeded: `Area needed (${MEASUREMENT_UNITS.pvBundleAreaNeeded})`,
  numberOfPanels: `Number of Panels (${MEASUREMENT_UNITS.number})`,
  costPerMonth: `Cost per Month (${MEASUREMENT_UNITS.cost})`,
  energyPlanName: `Energy Plan Name`,
  durationMonths: `Duration in Months`,
  energyPlanIncluded: `Energy Plan Included`,
  subscriptionIncluded: `Subscription Included`,
  detailsUrl: `Details (URL)`,
  detailsDoc: `Details (Upload document)`,
  inverterType: `Type of Inverter`,
  solarCellType: `Type of Solar Cell`,
  totalPanels: `Number of Pannels`,
  totalMPPT: `Number of MPPT's`,
  batteryType: `Type of Battery`,
}

type efficiencyType = 'efficiency' | 'roundtripEfficiency' | 'maxEfficiency'

export const efficiencyField = (type: efficiencyType = 'efficiency') =>
  float({
    label: LABELS[type],
    hooks: {
      validateInput: ({ resolvedData, fieldKey, addValidationError }) => {
        const value = resolvedData[fieldKey]
        if (value < 0 || value > 100) {
          addValidationError(`${type} must be between 1-100 percent`)
        }
      },
    },
  })

export const expiryDateField = calendarDay({
  validation: { isRequired: true },
  hooks: {
    validateInput: ({ resolvedData, fieldKey, addValidationError, item }) => {
      // item contains previous data
      if (resolvedData[fieldKey] < (resolvedData['approveDate'] || item?.['approveDate'])) {
        addValidationError('Expiry date must be greater than approve date')
      }
    },
  },
})

export const detailsDocTypeField = select({
  options: [
    { label: 'URL', value: 'url' },
    { label: 'Upload', value: 'upload' },
  ],
  ui: {
    displayMode: 'segmented-control',
  },
})

export const detailsDocValidationHooks: ListHooks<BaseListTypeInfo> = {
  validate: (args) => {
    if (args.operation === 'delete') return

    const { resolvedData, item, addValidationError } = args
    const detailsType = getSchemaValue(args, 'detailsType')
    const detailsUrl = getSchemaValue(args, 'details')
    const detailsDoc =
      resolvedData.detailsDoc?.connect?.id || (!resolvedData.detailsDoc?.disconnect && item?.detailsDocId)

    if ((detailsUrl || detailsDoc) && !detailsType) {
      addValidationError('Select details type')
    }

    if ((detailsType === 'url' && !detailsUrl) || (detailsType === 'upload' && !detailsDoc)) {
      addValidationError('Add details data for selected details type')
    }
  },
}

export const installerItemNameField = text({
  validation: { isRequired: false },
  ui: { createView: { fieldMode: 'hidden' }, itemView: { fieldMode: 'hidden' } },
})

const INSTALLER_ITEMS_MAPPING = {
  InstallerSolarPanel: 'solarPanel',
  InstallerInverter: 'inverter',
  InstallerBattery: 'battery',
}

export const installerItemHooks: ListHooks<BaseListTypeInfo> = {
  resolveInput: async ({ resolvedData, context, listKey }) => {
    const itemField = (INSTALLER_ITEMS_MAPPING as any)[listKey]

    const newlyAddedItem = resolvedData[itemField]?.connect?.id

    // Run the operation only when updates in item happens
    if (newlyAddedItem) {
      const data = await context.query[upperFirst(itemField)].findOne({
        where: { id: newlyAddedItem },
        query: 'modelNumber',
      })
      resolvedData.name = data?.modelNumber || ''
    }
    return resolvedData
  },
}

export const installerHooks: ListHooks<BaseListTypeInfo> = {
  resolveInput: async ({ inputData, operation, item, context, resolvedData }) => {
    const hasAllAffiliates = inputData?.hasAllAffiliates ?? item?.hasAllAffiliates
    const addedAffiliates = inputData?.affiliates?.connect
    const removedAffiliates = inputData?.affiliates?.disconnect

    if (operation === 'create' && !addedAffiliates?.length && hasAllAffiliates === false)
      return { error: 'Either add affiliates or select the checkbox for all affiliates' }
    if (addedAffiliates?.length) {
      return hasAllAffiliates || operation === 'create'
        ? { ...resolvedData, hasAllAffiliates: false }
        : resolvedData
    }
    if (operation === 'update') {
      try {
        const { affiliates } = await context.query.Installer.findOne({
          where: { id: item?.id.toString() },
          query: 'affiliates { id }',
        })
        const removedAllAffiliates = removedAffiliates?.length === affiliates?.length
        const noAffiliatesPresent = !inputData?.affiliates && !affiliates?.length
        if (affiliates?.length && !removedAllAffiliates) return { ...resolvedData, hasAllAffiliates: false }
        if ((removedAllAffiliates || noAffiliatesPresent) && hasAllAffiliates === false) {
          return { error: 'Either add affiliates or select the checkbox for all affiliates' }
        }
      } catch (e) {
        return { error: 'An Internal error occurred' }
      }
    }
    return resolvedData
  },
  validate: ({ resolvedData, addValidationError }) => {
    if (resolvedData?.error) {
      addValidationError(resolvedData?.error)
    }
  },
  // update installerId of solar bundle manually to trigger hook in solar bundle
  afterOperation: async (data) => {
    registerAuditLog(data)

    const { context, resolvedData, item } = data
    if (resolvedData?.bundles?.connect.length && item) {
      await context.query.SolarBundle.updateMany({
        data: resolvedData.bundles.connect.map((connectItem: { id: string }) => ({
          where: { id: connectItem.id },
          data: {
            installer: {
              connect: {
                id: item.id,
              },
            },
          },
        })),
      })
    }
  },
}

export const conditionalFieldValidation = (parentField: string, field: string) => ({
  ui: { description: `Enter this only when ${LABELS[parentField]} is checked` },
  hooks: {
    validateInput: ({ addValidationError, resolvedData, item }: any) => {
      const parentFieldValue = isUndefined(resolvedData[parentField])
        ? item?.[parentField]
        : resolvedData[parentField]
      const currVal = isUndefined(resolvedData[field]) ? item?.[field] : resolvedData[field]

      if (parentFieldValue && !currVal) {
        addValidationError(`${LABELS[field]} is required`)
      }
    },
  },
})
