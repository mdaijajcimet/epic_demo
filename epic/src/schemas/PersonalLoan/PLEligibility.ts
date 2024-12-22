import { list } from '@keystone-6/core'
import { json, relationship } from '@keystone-6/core/fields'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { eligibiltyFields, verticalLabelVirtualField } from '../Common/utils/schema'

const PLEligibility = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLEligibility', 'Eligibility'),
    personalLoan: relationship({ ref: 'PersonalLoan.eligibility', many: false, ui: readOnly({}, 'sidebar') }),
    ...eligibiltyFields,
    employment: json({
      ui: {
        views: path.join(process.cwd(), './src/customFields/employmentEligibilities'),
      },
      label: 'Employment Eligibilities',
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Eligibility Criteria',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLEligibility, { hideCreate: true }),
  },
})

export default PLEligibility
