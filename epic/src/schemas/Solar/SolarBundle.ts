import { list } from '@keystone-6/core'
import { checkbox, float, integer, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { LABELS, conditionalFieldValidation } from './utils'

const SolarBundle = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text(),
    bundleStatus: checkbox({
      defaultValue: true,
    }),
    energyPlanIncluded: checkbox(),
    energyPlanName: text(conditionalFieldValidation('energyPlanIncluded', 'energyPlanName')),
    subscriptionIncluded: checkbox(),
    durationMonths: float(conditionalFieldValidation('subscriptionIncluded', 'durationMonths')),
    costPerMonth: float(conditionalFieldValidation('subscriptionIncluded', 'costPerMonth')),
    installer: relationship({
      ref: 'Installer.bundles',
      many: false,
      ui: {
        hideCreate: true,
      },
    }),
    installerPanel: relationship({
      ref: 'InstallerSolarPanel',
      many: false,
    }),
    installerInverter: relationship({
      ref: 'InstallerInverter',
      many: false,
    }),
    installerBattery: relationship({
      ref: 'InstallerBattery',
      many: false,
    }),
    totalCost: float({ label: LABELS.totalCost }),
    stcRebate: float({ label: LABELS.stcRebate }),
    capacity: float({ label: LABELS.pvBundleCapacity }),
    numberOfPanels: integer({ label: LABELS.numberOfPanels }),
    areaNeeded: float({ label: LABELS.pvBundleAreaNeeded }),
    features: relationship({ ref: 'BundleFeature', many: true, ui: { labelField: 'description' } }),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.SolarBundle),
  },
  hooks: {
    afterOperation: async (data) => {
      // resolvedData contains newly added data only
      // item contains previous data if present
      registerAuditLog(data)

      const { context, item, resolvedData } = data
      const installerId = item?.installerId
      const installerPanelId = item?.installerPanelId
      const installerInverterId = item?.installerInverterId
      const installerBatteryId = item?.installerBatteryId

      const connectedInstallerId = resolvedData?.installer?.connect?.id
      const connectedPanelId = resolvedData?.installerPanel?.connect?.id
      const connectedInverterId = resolvedData?.installerInverter?.connect?.id
      const connectedBatteryId = resolvedData?.installerBattery?.connect?.id

      // Update installerId of all items only when new related panel added or new installer connected

      if ((connectedPanelId && installerId) || (connectedInstallerId && installerPanelId)) {
        await context.query.InstallerSolarPanel.updateOne({
          where: {
            id: connectedPanelId || installerPanelId,
          },
          data: {
            installer: {
              connect: {
                id: installerId || connectedInstallerId,
              },
            },
          },
        })
      }
      if ((connectedInverterId && installerId) || (connectedInstallerId && installerInverterId)) {
        await context.query.InstallerInverter.updateOne({
          where: {
            id: connectedInverterId || installerInverterId,
          },
          data: {
            installer: {
              connect: {
                id: installerId || connectedInstallerId,
              },
            },
          },
        })
      }
      if ((connectedBatteryId && installerId) || (connectedInstallerId && installerBatteryId)) {
        await context.query.InstallerBattery.updateOne({
          where: {
            id: connectedBatteryId || installerBatteryId,
          },
          data: {
            installer: {
              connect: {
                id: installerId || connectedInstallerId,
              },
            },
          },
        })
      }
    },
  },
})

export default SolarBundle
