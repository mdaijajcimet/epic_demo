/* eslint-disable @typescript-eslint/no-explicit-any */
import Query from '../graphql/queries'

type FilterType = {
  label: string
  value: string
  query: string
  variables: any
  type: string
}
type Config = {
  [path: string]: {
    filters: FilterType[]
  }
}
const config: Config = {
  Page: {
    filters: [
      {
        label: 'Domain',
        value: 'domain',
        query: Query.pageDomain.query,
        variables: Query.pageDomain.variables,
        type: Query.pageDomain.type,
      },
      {
        label: 'Type',
        value: 'type',
        query: Query.pageType.query,
        variables: Query.pageType.variables,
        type: Query.pageType.type,
      },
    ],
  },
  Vertical: {
    filters: [
      {
        label: 'Name',
        value: 'name',
        query: Query.verticalName.query,
        variables: Query.verticalName.variables,
        type: Query.verticalName.type,
      },
    ],
  },
}

export default config

export type ImportTablesMap = {
  filterKeys: string[]
  requiredFields?: string[]
}
export const mappedTables: Record<string, ImportTablesMap> = {
  Addon: { filterKeys: ['addonId'], requiredFields: [] },
  AddonFeature: { filterKeys: ['description'], requiredFields: [] },
  Affiliate: { filterKeys: ['affiliateId'], requiredFields: [] },
  Attribute: { filterKeys: ['key'], requiredFields: [] },
  BundleFeature: { filterKeys: ['description'], requiredFields: [] },
  CreditCard: { filterKeys: ['uuid'], requiredFields: [] },
  Field: { filterKeys: ['name'], requiredFields: [] },
  Installer: { filterKeys: ['name'], requiredFields: [] },
  InstallerContact: { filterKeys: ['contactNumber'], requiredFields: [] },
  InstallerLicence: { filterKeys: ['number'], requiredFields: [] },
  Inverter: { filterKeys: ['modelNumber'], requiredFields: [] },
  IgnoreList: {
    filterKeys: ['parameterContent'],
    requiredFields: ['parameterContent', 'parameter', 'type', 'taggedAs'],
  },
  IgnoreParameter: { filterKeys: ['name'], requiredFields: ['name'] },
  IgnoreType: { filterKeys: ['name'], requiredFields: ['name'] },
  Manufacturer: { filterKeys: ['name'], requiredFields: [] },
  Page: { filterKeys: ['slug'], requiredFields: ['title', 'domain', 'type'] },
  Plan: { filterKeys: ['planId'], requiredFields: [] },
  Provider: { filterKeys: ['providerId', 'slug'], requiredFields: [] },
  Reward: { filterKeys: ['name'], requiredFields: [] },
  Script: { filterKeys: ['slug'], requiredFields: [] },
  SolarAddon: { filterKeys: ['name'], requiredFields: [] },
  SolarPanel: { filterKeys: ['modelNumber'], requiredFields: [] },
  State: { filterKeys: ['name'], requiredFields: [] },
  SubAffiliate: { filterKeys: ['subAffiliateId'], requiredFields: [] },
  User: { filterKeys: ['email'], requiredFields: [] },
  Vertical: { filterKeys: ['slug'], requiredFields: [] },
  TariffCode: { filterKeys: ['tariffCode'], requiredFields: [] },
}

export const TARIFF_CODE_VERTICALS = ['energy', 'solar'] as const
export type TariffCodeVertical = (typeof TARIFF_CODE_VERTICALS)[number]
export const TARIFF_CODE_TABLE_NAME = 'TariffCode'
const TARIFF_CODE_SOLAR_HEADERS = [
  'serialNo',
  'distributor',
  'provider',
  'propertyType',
  'states',
  'tariffCode',
]
export const TARIFF_CODE_HEADERS: { [K in TariffCodeVertical]: string[] } = {
  solar: TARIFF_CODE_SOLAR_HEADERS,
  energy: [...TARIFF_CODE_SOLAR_HEADERS, 'tariffType'],
}
