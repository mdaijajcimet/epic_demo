import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'

import { ModuleOpAccessArgs } from '../../utils/access'

const IgnoreDataContent = list({
  access: {
    operation: {
      ...ModuleOpAccessArgs.operation,
      delete: () => false,
    },
  },
  fields: {
    text: text({
      isIndexed: 'unique',
      validation: { isRequired: true },
    }),
  },
  ui: {
    hideCreate: true,
    hideDelete: true,
    isHidden: true,
  },
})

export default IgnoreDataContent
