import { list } from '@keystone-6/core'
import { checkbox, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { verticalLabelVirtualField } from '../Common/utils/schema'

const PLFeature = list({
  access: ModuleOpAccessArgs,
  fields: {
    ...verticalLabelVirtualField('personalLoan', 'PLFeature', 'Feature'),
    personalLoan: relationship({ ref: 'PersonalLoan.features', many: false, ui: readOnly({}, 'sidebar') }),
    withExtraRepayment: checkbox(),
    withRedrawFacility: checkbox(),
    isFullyDrawnAdvance: checkbox(),
    withInstantApproval: checkbox(),
    topUpFacilityAvailable: checkbox(),
    featureDescription: text({
      ui: {
        displayMode: 'textarea',
        description: 'Add a new feature per line. E.g \nThis is Feature 1 \nThis is feature 2',
      },
    }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Features',
    labelField: 'label',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PLFeature, { hideCreate: true }),
  },
})

export default PLFeature
