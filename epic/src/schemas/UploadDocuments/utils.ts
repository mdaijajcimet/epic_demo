import size from 'lodash/size'

import { nestedSelect } from '../../customFields/nestedSelect'
import { getFormOptionKeyDesc, getSchemaValue } from '../../utils/schemas'

export const uploadSchemaKeyField = (keyName: string) =>
  nestedSelect({
    options: [],
    filterKey: keyName,
    isDynamic: true,
    ui: { description: getFormOptionKeyDesc(keyName) },
    childType: 'single',
    hooks: {
      validate: ({ ...args }) => {
        if (args.operation === 'delete') return

        const key = getSchemaValue(args, 'key')
        if (!key || !size(JSON.parse(key)?.subOptions)) args?.addValidationError('Key is required field')
      },
    },
  })
