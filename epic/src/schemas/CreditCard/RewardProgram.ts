import { list } from '@keystone-6/core'
import { checkbox, text, relationship } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { customDecimal, readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const RewardProgram = list({
  access: ModuleOpAccessArgs,
  fields: {
    creditCard: relationship({
      ref: 'CreditCard.rewardProgram',
      many: false,
      ui: readOnly({}, 'sidebar'),
    }),
    name: text({ label: 'Name of the reward program', validation: { isRequired: true } }),
    isReward: checkbox({
      ui: {
        description: 'Default Reward',
        itemView: { fieldPosition: 'sidebar' },
      },
    }),
    isFrequentFlyer: checkbox({
      ui: {
        description: 'This is true if the partner programs are velocity, qantas, etc.',
        itemView: { fieldPosition: 'sidebar' },
      },
    }),
    icon: relationship({ ref: 'Media', many: false }),
    rewards: relationship({ ref: 'Reward', many: true }),
    pointsCondition: text({ ui: { description: '2 reward points per 1$...' } }),
    rewardProgramFee: customDecimal(),
    rewardPointsExpiry: text(),
  },
  hooks: {
    validate: async ({ operation, resolvedData, item, addValidationError }) => {
      if (operation === 'delete') return

      let { isReward, isPartner } = resolvedData
      if (operation === 'update') {
        if (typeof isReward === 'undefined') {
          isReward = item?.isReward
        }
        if (typeof isPartner === 'undefined') {
          isPartner = item?.isPartner
        }
      }
      if (!isReward && !isPartner) {
        addValidationError('Voilating unique constraint: check either reward or partner.')
      }
    },
    afterOperation: (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Rewards',
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.RewardProgram, { hideCreate: true }),
  },
})

export default RewardProgram
