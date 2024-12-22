import { list } from '@keystone-6/core'
import { checkbox, text } from '@keystone-6/core/fields'
import isUndefined from 'lodash/isUndefined'

import registerAuditLog from '../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../config/access'
import { SPLIT_WITHOUT_SPACE_REGEX } from '../constants/common'
import { encryptedText } from '../customFields/encryptedText'
import validateEmail from '../libs/validateEmail'
import { validateIPRange } from '../libs/validateIPAddress'
import type { ListHookFuncArgs } from '../types'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../utils/access'

const PasswordSetting = list({
  access: ModuleOpAccessArgs,
  fields: {
    password: encryptedText({
      validation: { isRequired: true },
    }),
    enableEmailLogs: checkbox({
      defaultValue: true,
      ui: { description: 'Sends emails to mentioned mail ids on data access' },
    }),
    logEmails: text({
      ui: {
        description: 'Add email addresses to which the log must be sent.',
      },
    }),
    type: text({
      validation: { isRequired: true },
    }),
    allowedIps: text({
      ui: {
        description:
          'ADMIN user will be able to see EXPORT button only on allowed IPs. \nE.g.: \n237.85.16.86, 184.144.174.25, 2001:db82:3333:4444:0000:6:7aF7:8888',
      },
    }),
  },
  hooks: {
    validate: async (args) => {
      if (args.operation === 'delete') return

      const { addValidationError, resolvedData } = args

      if (!isUndefined(resolvedData.enableEmailLogs) || !isUndefined(resolvedData.logEmails)) {
        validateLogEmails(args)
      }

      if (resolvedData?.allowedIps) {
        const allowedIps = resolvedData.allowedIps
        const { invalidIps = [] } = validateIPRange(allowedIps, 1)
        if (invalidIps.length)
          addValidationError(`The following IP addresses are invalid: ${invalidIps.join(', ')}`)
      }
    },

    afterOperation: async (data) => registerAuditLog(data),
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.PasswordSetting),
  },
})

const validateLogEmails = ({
  resolvedData,
  item,
  addValidationError,
}: ListHookFuncArgs<'validateInput'>[0]) => {
  const enableEmailLogs = resolvedData.enableEmailLogs ?? item?.enableEmailLogs
  const logEmails = resolvedData.logEmails ?? item?.logEmails
  if (enableEmailLogs && !logEmails.trim()) {
    addValidationError('Log Emails are required when logging is enabled.')
    return
  }
  if (!isUndefined(resolvedData.logEmails) && logEmails.length) {
    const emailData: string[] = (resolvedData.logEmails ?? '').trim().split(SPLIT_WITHOUT_SPACE_REGEX)
    const invalidMails: string[] = []
    emailData.forEach((email) => !validateEmail(email) && invalidMails.push(email))

    if (invalidMails.length)
      addValidationError(`The following mail ids are invalid: ${invalidMails.join(', ')}`)
  }
}

export default PasswordSetting
