import { list } from '@keystone-6/core'
import { float, relationship, text } from '@keystone-6/core/fields'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { LABELS } from './utils'

const InstallerAddon = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text(),
    cost: float({ label: LABELS.cost }),
    addon: relationship({ ref: 'SolarAddon', many: false }),
    image: relationship({
      ref: 'Media',
      many: false,
    }),
    installer: relationship({ ref: 'Installer', many: false }),
  },
  hooks: {
    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.InstallerAddon),
  },
})

export default InstallerAddon
