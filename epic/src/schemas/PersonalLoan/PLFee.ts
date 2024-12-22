import { group, list } from '@keystone-6/core'
import { float, integer, relationship, select } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { validateRangeValues } from '../../utils/schemas'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const feeType = () =>
  select({
    options: [
      { label: 'Currency', value: 'currency' },
      { label: 'Percent', value: 'percent' },
    ],
    defaultValue: 'currency',
    ui: { displayMode: 'segmented-control' },
  })

const PLFee = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLFee', 'Fee'),
    personalLoan: relationship({ ref: 'PersonalLoan.fees', many: false, ui: readOnly({}, 'sidebar') }),
    ...group({
      label: 'Upfront Fee',
      fields: {
        upfrontFeeType: feeType(),
        minUpfrontFee: float({ validation: { min: 0 } }),
        maxUpfrontFee: float({ validation: { min: 0 } }),
      },
    }),
    ...group({
      label: 'Application Fee',
      fields: {
        applicationFeeType: feeType(),
        minApplicationFee: float({ validation: { min: 0 } }),
        maxApplicationFee: float({ validation: { min: 0 } }),
      },
    }),
    ...group({
      label: 'Risk Fee',
      fields: {
        minRiskFee: float({ validation: { min: 0 } }),
        maxRiskFee: float({ validation: { min: 0 } }),
      },
    }),
    ...group({
      label: 'Settlement Cheque Fee',
      fields: {
        settlementFreeCheque: integer({ validation: { min: 0 } }),
        settlementChequeFee: float({ validation: { min: 0 } }),
      },
    }),
    ...group({
      label: 'Other Fee',
      fields: {
        earlyTerminationFee: float({
          label: 'Early Termination/Repayment/Exit Fee',
          validation: { min: 0 },
        }),
        extraRepaymentFee: float({ validation: { min: 0 } }),
        missedPaymentPenalty: float({ validation: { min: 0 } }),
        ongoingFee: float({ validation: { min: 0 } }),
        overCounterPaymentFee: float({ validation: { min: 0 } }),
        establishmentFee: float({ validation: { min: 0 } }),
        brokerageFee: float({ validation: { min: 0 } }),
        securityFee: float({ validation: { min: 0 } }),
        monthlyFee: float({ validation: { min: 0 } }),
        loanServiceFee: float({ validation: { min: 0 } }),
        dishonourFee: float({ validation: { min: 0 } }),
        overdueAccountFee: float({ validation: { min: 0 } }),
        brokerOriginationFee: float({ validation: { min: 0 } }),
      },
    }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    validate: (args) => {
      if (args.operation === 'delete') return
      validateRangeValues(args, 'minUpfrontFee', 'maxUpfrontFee', {
        typeField: 'upfrontFeeType',
      })
      validateRangeValues(args, 'minApplicationFee', 'maxApplicationFee', {
        typeField: 'applicationFeeType',
      })
      validateRangeValues(args, 'minRiskFee', 'maxRiskFee')
    },
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Fees',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLFee, { hideCreate: true }),
  },
})

export default PLFee
