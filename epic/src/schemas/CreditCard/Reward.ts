import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import buildSlug from '../../libs/buildSlug'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const Reward = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({
      label: 'Reward name',
      validation: { isRequired: true },
      isIndexed: 'unique',
      ui: {
        description: 'Cashback, Gift card, Velocity frequent flyer, Qantas, Internation flights, etc..',
      },
    }),
    slug: text({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === 'create' && !inputData.slug) {
            return buildSlug(inputData.name)
          }

          return resolvedData?.slug
        },
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
      },
    }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    label: 'Plan Rewards',
    labelField: 'name',
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Reward, { hideCreate: true }),
  },
})

export default Reward
