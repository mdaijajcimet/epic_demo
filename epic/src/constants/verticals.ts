import type { FalconVerticalKeys, LmsVerticalKeys, VerticalConfig } from '../types/verticals'

export const VerticalSlug = {
  broadband: 'broadband',
  energy: 'energy',
  mobile: 'mobile',
  solar: 'solar',
  creditCards: 'credit-cards',
  healthInsurance: 'health-insurance',
  bundle: 'bundle',
  personalLoan: 'personal-loans',
}

export const VERTICAL_KEYS = Object.keys(VerticalSlug)

export const getVerticalSlugsByKeys = (keys: (keyof typeof VerticalSlug)[]) => {
  return keys.map((key) => VerticalSlug[key])
}

export const newScriptRelatedVerticals = getVerticalSlugsByKeys([
  'creditCards',
  'healthInsurance',
  'personalLoan',
])

export const oldScriptRelatedVerticals = getVerticalSlugsByKeys(['broadband', 'mobile', 'energy', 'solar'])

export const falconVerticalsConfig: Record<FalconVerticalKeys, VerticalConfig> = {
  creditCards: {
    name: 'Credit Cards',
    slug: VerticalSlug.creditCards,
  },
  solar: {
    name: 'Solar',
    slug: VerticalSlug.solar,
  },
  healthInsurance: {
    name: 'Health Insurance',
    slug: VerticalSlug.healthInsurance,
  },
  personalLoan: {
    name: 'Personal Loan',
    slug: VerticalSlug.personalLoan,
  },
} as const

export const lmsVerticalsConfig: Record<LmsVerticalKeys, VerticalConfig> = {
  broadband: {
    name: 'Broadband',
    slug: VerticalSlug.broadband,
  },
  energy: {
    name: 'Energy',
    slug: VerticalSlug.energy,
  },
  mobile: {
    name: 'Mobile',
    slug: VerticalSlug.mobile,
  },
  bundle: {
    name: 'Bundle',
    slug: VerticalSlug.bundle,
  },
} as const

export const verticalsConfig = [...Object.values(falconVerticalsConfig), ...Object.values(lmsVerticalsConfig)]
