import { list } from '@keystone-6/core'
import { float, integer, relationship, select, text, checkbox } from '@keystone-6/core/fields'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import validateEmail from '../../libs/validateEmail'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { installerItemHooks, installerItemNameField, LABELS, installerHooks } from './utils'

const Installer = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    logo: relationship({
      ref: 'Media',
      many: false,
    }),
    displayLogo: checkbox({
      defaultValue: true,
    }),
    affiliates: relationship({ ref: 'Affiliate', many: true, ui: { hideCreate: true } }),
    hasAllAffiliates: checkbox({
      label: 'Is this Installer related to all affiliates?',
      ui: { description: 'Only works if affiliates are empty ' },
      defaultValue: true,
    }),
    subAffiliates: relationship({
      ref: 'SubAffiliate',
      many: true,
      ui: { hideCreate: true },
    }),
    licence: relationship({
      ref: 'InstallerLicence',
      many: true,
      ui: {
        labelField: 'number',
        views: path.join(process.cwd(), './src/customFields/InstallerFilters'),
      },
    }),
    zones: relationship({
      ref: 'InstallerZone',
      many: true,
      ui: {
        labelField: 'title',
        views: path.join(process.cwd(), './src/customFields/InstallerFilters'),
      },
    }),
    bundles: relationship({
      ref: 'SolarBundle.installer',
      many: true,
      ui: {
        views: path.join(process.cwd(), './src/customFields/InstallerFilters'),
      },
    }),
    contacts: relationship({
      ref: 'InstallerContact',
      many: true,
      ui: {
        views: path.join(process.cwd(), './src/customFields/InstallerFilters'),
      },
    }),
    addons: relationship({
      ref: 'InstallerAddon',
      many: true,
      ui: {
        views: path.join(process.cwd(), './src/customFields/InstallerFilters'),
      },
    }),
    depositType: select({
      options: [
        { label: 'Percent', value: 'percent' },
        { label: 'Fixed', value: 'fixed' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    depositValue: float({
      hooks: {
        validateInput: ({ addValidationError, item, resolvedData }) => {
          // resolvedData will have null when data is removed, undefined when data is not added
          const depositType =
            // Make sure this wont take previous stored item when data is removed
            resolvedData['depositType'] || (resolvedData['depositType'] !== null && item?.['depositType'])

          const depositValue =
            resolvedData['depositValue'] || (resolvedData['depositValue'] !== null && item?.['depositValue'])

          if (depositValue && !depositType) {
            return addValidationError('Select deposit type to add deposit value')
          }
          if (depositType === 'percent' && depositValue && (depositValue < 0 || depositValue > 100)) {
            addValidationError('deposit value must be between 0 - 100')
          }
        },
      },
    }),
    nextStepGuidance: text({ ui: { displayMode: 'textarea' } }),
  },
  hooks: installerHooks,
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Installer),
  },
})

const InstallerContact = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    type: select({
      type: 'enum',
      options: [
        { label: 'Telephone', value: 'telephone' },
        { label: 'Mobile', value: 'mobile' },
      ],
      defaultValue: 'mobile',
      label: 'Contact Number Type',
    }),
    contactNumber: integer({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    email: text({
      hooks: {
        validateInput: ({ resolvedData, addValidationError }) => {
          if (resolvedData?.email && !validateEmail(resolvedData.email)) {
            addValidationError('Invalid Email')
          }
        },
      },
    }),
    installer: relationship({ ref: 'Installer', many: false }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerContact),
  },
})

const InstallerLicence = list({
  access: ModuleOpAccessArgs,
  fields: {
    state: relationship({ ref: 'State', many: false }),
    number: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
    }),
    postcodes: text({ ui: { displayMode: 'textarea' } }), // array of postcodes
    installer: relationship({ ref: 'Installer', many: false }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerLicence),
  },
})

const InstallerSolarPanel = list({
  access: ModuleOpAccessArgs,
  fields: {
    installer: relationship({ ref: 'Installer', many: false, ui: { hideCreate: true } }),
    solarPanel: relationship({ ref: 'SolarPanel', many: false, ui: { labelField: 'modelNumber' } }),
    cost: float({ label: LABELS.cost, validation: { isRequired: true } }),
    warranty: integer({ label: LABELS.warranty, validation: { isRequired: true } }),
    warrantyClaims: float({ label: LABELS.warrantyClaims, validation: { isRequired: true } }),
    image: relationship({
      ref: 'Media',
      many: false,
    }),
    name: installerItemNameField,
  },
  hooks: {
    ...installerItemHooks,
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerSolarPanel),
  },
})

const InstallerInverter = list({
  access: ModuleOpAccessArgs,
  fields: {
    installer: relationship({ ref: 'Installer', many: false, ui: { hideCreate: true } }),
    inverter: relationship({ ref: 'Inverter', many: false, ui: { labelField: 'modelNumber' } }),
    cost: float({ label: LABELS.cost, validation: { isRequired: true } }),
    warranty: integer({ label: LABELS.warranty, validation: { isRequired: true } }),
    warrantyClaims: float({ label: LABELS.warrantyClaims, validation: { isRequired: true } }),
    image: relationship({
      ref: 'Media',
      many: false,
    }),
    name: installerItemNameField,
  },
  hooks: {
    ...installerItemHooks,
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerInverter),
  },
})

const InstallerBattery = list({
  access: ModuleOpAccessArgs,
  fields: {
    installer: relationship({ ref: 'Installer', many: false, ui: { hideCreate: true } }),
    battery: relationship({ ref: 'Battery', many: false, ui: { labelField: 'modelNumber' } }),
    cost: float({ label: LABELS.cost, validation: { isRequired: true } }),
    warranty: integer({ label: LABELS.warranty, validation: { isRequired: true } }),
    warrantyClaims: float({ label: LABELS.warrantyClaims, validation: { isRequired: true } }),
    image: relationship({
      ref: 'Media',
      many: false,
    }),
    name: installerItemNameField,
  },
  hooks: {
    ...installerItemHooks,
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerBattery),
  },
})

const InstallerZone = list({
  access: ModuleOpAccessArgs,
  fields: {
    title: text({
      validation: { isRequired: true },
    }),
    state: relationship({ ref: 'State', many: false }),
    postcodes: text({ ui: { displayMode: 'textarea' } }),
    addedCostDifference: integer({
      validation: { isRequired: true },
      defaultValue: 0,
    }),
    installer: relationship({ ref: 'Installer', many: false }),
  },
  hooks: {
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerZone),
  },
})

export default {
  Installer,
  InstallerContact,
  InstallerLicence,
  InstallerInverter,
  InstallerSolarPanel,
  InstallerBattery,
  InstallerZone,
}
