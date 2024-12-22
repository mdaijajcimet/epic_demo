import { list } from '@keystone-6/core'
import { checkbox, text } from '@keystone-6/core/fields'

import { createdAtSchema } from '../Common/common'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'

const Mirn = list({
  access: ModuleOpAccessArgs,
  fields: {
    fileName: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    status: checkbox(),
    createdAt: createdAtSchema(),
  },
  graphql: {},
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Mirn),
  },
})
export default Mirn
