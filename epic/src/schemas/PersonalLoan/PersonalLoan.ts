import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { affiliatesSchemaFields, verticalProductCommonFields } from '../Common/common'
import { DocumentFields, EligibilityFields, PerkFields, SpecialFields } from '../Common/constants'
import { addAffiliates, addSubAffiliates, commonCardUI, resolveAffiliates } from '../Common/utils/common'
import { DetailFields, FeatureFields, FeeFields } from './constants'
import { clickoutSchemaFields } from '../Common/utils/schema'

const PersonalLoan = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalProductCommonFields({
      providerRef: 'PLProvider.loans',
      providerMode: 'read',
    }),
    ...affiliatesSchemaFields('plPlan'),
    loanDetail: relationship({
      ref: 'PLLoanDetail.personalLoan',
      many: false,
      ui: { ...commonCardUI({ inlineFields: DetailFields }) },
    }),
    fees: relationship({
      ref: 'PLFee.personalLoan',
      many: false,
      ui: { ...commonCardUI({ inlineFields: FeeFields }) },
    }),
    features: relationship({
      ref: 'PLFeature.personalLoan',
      many: false,
      ui: { ...commonCardUI({ inlineFields: FeatureFields }) },
    }),
    eligibility: relationship({
      ref: 'PLEligibility.personalLoan',
      many: false,
      ui: { ...commonCardUI({ inlineFields: EligibilityFields }) },
    }),
    documents: relationship({
      ref: 'PLDocument.personalLoan',
      many: false,
      ui: { ...commonCardUI({ inlineFields: DocumentFields }) },
    }),
    specials: relationship({
      ref: 'PLSpecial.personalLoan',
      many: true,
      label: 'Special Offer [ Many ]',
      ui: { ...commonCardUI({ inlineFields: SpecialFields, cardFields: ['name'] }) },
    }),
    perks: relationship({
      ref: 'PLPerk.personalLoan',
      many: true,
      label: 'Perks [ Many ]',
      ui: { ...commonCardUI({ inlineFields: PerkFields, cardFields: ['name'] }) },
    }),
    creditScores: relationship({
      ref: 'CreditScore',
      many: true,
      ui: {
        hideCreate: true,
      },
    }),
    ...clickoutSchemaFields(),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    resolveInput: async (data) => {
      const resolvedData = await resolveAffiliates(data)
      return resolvedData
    },
    afterOperation: async (data) => {
      await addAffiliates(data)
      await Promise.all([addSubAffiliates(data), registerAuditLog(data)])
    },
  },
  ui: {
    label: 'Plans',
    labelField: 'name',
    hideCreate: true,
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PersonalLoan, { hideCreate: true }),
  },
})

export default PersonalLoan
