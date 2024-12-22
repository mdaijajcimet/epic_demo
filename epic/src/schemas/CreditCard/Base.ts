import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { affiliatesSchemaFields, verticalProductCommonFields } from '../Common/common'
import {
  CommonUploadFields,
  DocumentFields,
  EligibilityFields,
  PerkFields,
  SpecialFields,
} from '../Common/constants'
import { addAffiliates, addSubAffiliates, commonCardUI, resolveAffiliates } from '../Common/utils/common'
import { clickoutSchemaFields } from '../Common/utils/schema'
import {
  BalanceTransferFields,
  DetailFields,
  EarnRateFields,
  FeatureFields,
  FeeFields,
  OverseasSpendFields,
  RateFields,
  RewardProgramFields,
} from './constants'

const CreditCard = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalProductCommonFields({
      providerRef: 'ProviderCreditCard.creditCards',
      providerMode: 'read',
    }),
    ...affiliatesSchemaFields('ccPlan'),
    details: relationship({
      ref: 'CardDetail.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: DetailFields }) },
    }),
    fees: relationship({
      ref: 'CreditCardFee.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: FeeFields }) },
    }),
    rates: relationship({
      ref: 'Rate.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: RateFields }) },
    }),
    overseasSpends: relationship({
      ref: 'OverseasSpend.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: OverseasSpendFields }) },
    }),
    eligibility: relationship({
      ref: 'CCEligibility.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: EligibilityFields }) },
    }),
    documents: relationship({
      ref: 'CCDocument.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: DocumentFields }) },
    }),
    balanceTransfer: relationship({
      ref: 'BalanceTransfer.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: BalanceTransferFields }) },
    }),
    rewardProgram: relationship({
      ref: 'RewardProgram.creditCard',
      many: false,
      ui: { ...commonCardUI({ inlineFields: RewardProgramFields, cardFields: ['name'] }) },
    }),
    cardFeatures: relationship({
      ref: 'CardFeature.creditCard',
      many: true,
      label: 'Features [ Many ]',
      ui: { ...commonCardUI({ inlineFields: FeatureFields, cardFields: ['name'] }) },
    }),
    earnRates: relationship({
      ref: 'EarnRate.creditCard',
      many: true,
      label: 'Earn Rates [ Many ]',
      ui: { ...commonCardUI({ inlineFields: EarnRateFields }) },
    }),
    specials: relationship({
      ref: 'Special.creditCard',
      many: true,
      label: 'Special Offer [ Many ]',
      ui: { ...commonCardUI({ inlineFields: SpecialFields, cardFields: ['name'] }) },
    }),
    perks: relationship({
      ref: 'CCPerk.creditCard',
      many: true,
      label: 'Perks [ Many ]',
      ui: { ...commonCardUI({ inlineFields: PerkFields, cardFields: ['name'] }) },
    }),
    uploadGroup: relationship({
      ref: 'CCUploadGroup.creditCard',
      many: true,
      label: 'UploadGroup [ Many ] - Override',
      ui: {
        ...commonCardUI({
          inlineFields: CommonUploadFields,
          inlineConnect: true,
          hideRemove: false,
        }),
      },
    }),
    additionalQuestions: relationship({
      ref: 'AdditionalQuestion.creditCard',
      many: true,
    }),
    creditScores: relationship({
      ref: 'CreditScore',
      many: true,
      ui: {
        hideCreate: true,
      },
    }),
    customConfig: relationship({
      ref: 'CustomAttribute',
      many: true,
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
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.CreditCard, { hideCreate: true }),
  },
})

export default CreditCard
