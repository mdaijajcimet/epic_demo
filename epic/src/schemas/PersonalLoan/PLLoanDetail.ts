import { group, list } from '@keystone-6/core'
import { float, integer, multiselect, relationship, select, text } from '@keystone-6/core/fields'
import isUndefined from 'lodash/isUndefined'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { FORM_OPTION_KEYS, TIMESTAMP_SCHEMA } from '../../constants/schema'
import { nestedSelect } from '../../customFields/nestedSelect'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { getFormOptionKeyDesc, validateRangeValues } from '../../utils/schemas'
import { verticalLabelVirtualField } from '../Common/utils/schema'
import { LABELS } from './constants'

const PLLoanDetail = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLLoanDetail', 'Details'),
    personalLoan: relationship({ ref: 'PersonalLoan.loanDetail', many: false, ui: readOnly({}, 'sidebar') }),
    interestType: select({
      label: 'Loan Type / Interest Rate Type',
      options: [
        { label: 'Fixed', value: 'fixed' },
        { label: 'Variable', value: 'variable' },
      ],
      ui: { displayMode: 'segmented-control', itemView: { fieldPosition: 'sidebar' } },
      defaultValue: 'fixed',
      validation: { isRequired: true },
    }),
    securityType: select({
      options: [
        { label: 'Secured', value: 'secured' },
        { label: 'Unsecured', value: 'unsecured' },
      ],
      ui: { displayMode: 'segmented-control', itemView: { fieldPosition: 'sidebar' } },
      defaultValue: 'secured',
      validation: { isRequired: true },
    }),
    repaymentFrequency: multiselect({
      type: 'string',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Fortnightly', value: 'fortnightly' },
        { label: 'Weekly', value: 'weekly' },
      ],
      defaultValue: ['monthly', 'fortnightly', 'weekly'],
      hooks: {
        validateInput({ addValidationError, resolvedData: { repaymentFrequency } }) {
          if (!isUndefined(repaymentFrequency) && !repaymentFrequency?.length)
            addValidationError('Repayment Frequency is required')
        },
      },
    }),
    loanPurpose: nestedSelect({
      label: 'Loan Purpose',
      options: [],
      isDynamic: true,
      filterKey: FORM_OPTION_KEYS.PL_LOAN_PURPOSE_DETAIL,
      ui: { description: getFormOptionKeyDesc(FORM_OPTION_KEYS.PL_LOAN_PURPOSE_DETAIL) },
    }),
    minLoanAmount: integer({
      validation: { isRequired: true, min: 0 },
    }),
    maxLoanAmount: integer({ validation: { min: 0 } }),
    minLoanTerm: integer({
      validation: { isRequired: true, min: 0 },
      label: `Min ${LABELS.loanTerm}`,
    }),
    maxLoanTerm: integer({
      validation: { isRequired: true, min: 0 },
      label: `Max ${LABELS.loanTerm}`,
    }),
    minInterestRate: float({
      validation: { isRequired: true, min: 0, max: 100 },
      label: `Min ${LABELS.interestRate}`,
    }),
    maxInterestRate: float({ validation: { min: 0, max: 100 }, label: `Max ${LABELS.interestRate}` }),
    minComparisonRate: float({ validation: { isRequired: true, min: 0, max: 100 } }),
    maxComparisonRate: float({ validation: { min: 0, max: 100 } }),
    ...group({
      label: 'Representative Rate',
      fields: {
        fixedRepresentativeRate: float({
          validation: { min: 0, max: 100 },
        }),
        comparisonRepresentativeRate: float({
          validation: { min: 0, max: 100 },
        }),
      },
    }),
    fundingTime: integer(),
    fundingTimeFrequency: select({
      options: [
        { label: 'Hour', value: 'hour' },
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
      ],
      ui: { displayMode: 'segmented-control' },
    }),
    otherInformation: text({
      ui: { displayMode: 'textarea' },
    }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    validate: (args) => {
      if (args.operation === 'delete') return

      validateRangeValues(args, 'minLoanAmount', 'maxLoanAmount')
      validateRangeValues(args, 'minLoanTerm', 'maxLoanTerm')
      validateRangeValues(args, 'minInterestRate', 'maxInterestRate')
      validateRangeValues(args, 'minComparisonRate', 'maxComparisonRate')
    },
    afterOperation: async (args) => {
      await registerAuditLog(args)
    },
  },
  ui: {
    label: 'Plan Details',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLLoanDetail, { hideCreate: true }),
  },
})

export default PLLoanDetail
