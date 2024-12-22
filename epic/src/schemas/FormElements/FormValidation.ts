import { list } from '@keystone-6/core'
import { checkbox, integer, relationship, select, text } from '@keystone-6/core/fields'
import { isNil, isUndefined, upperFirst } from 'lodash'

import registerAuditLog from '../../../registerAuditLog'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { DatePattern } from '../../constants/common'
import { FORM_VALIDATION_SCHEMA_TYPES_MAP, MIN_MAX_DESCRIPTION } from '../../constants/formElement'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import { readOnly } from '../../utils'
import { ModuleOpAccessArgs, getModuleUIArgs } from '../../utils/access'
import { getSchemaValue } from '../../utils/schemas'

const FormValidation = list({
  access: ModuleOpAccessArgs,
  fields: {
    name: text({ validation: { isRequired: true } }),
    formField: relationship({
      ref: 'FormField.validations',
      many: false,
      ui: readOnly({ labelField: 'name' }),
    }),
    type: select({
      options: [
        { label: 'String', value: 'string' },
        { label: 'Name', value: 'name' },
        { label: 'Email', value: 'email' },
        { label: 'Numeric String', value: 'numeric' },
        { label: 'AlphaNumeric String', value: 'alphaNumeric' },
        { label: 'Mobile Number', value: 'mobile' },
        { label: 'Number', value: 'number' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Date', value: 'date' },
        { label: 'Date Of Birth', value: 'dob' },
        { label: 'Past Date', value: 'pastDate' },
        { label: 'Future Date', value: 'futureDate' },
      ],
      defaultValue: 'string',
      validation: { isRequired: true },
    }),
    typeMessage: text({
      label: 'Invalid data type validation message',
    }),
    required: checkbox({
      defaultValue: true,
    }),
    requiredMessage: text({ label: 'Required validation Message' }),
    length: integer({
      ui: { description: 'Applicable for string type' },
      validation: { min: 1 },
    }),
    lengthMessage: text({ label: 'Invalid length validation Message' }),
    min: text({ ui: { description: MIN_MAX_DESCRIPTION } }),
    minMessage: text({ label: 'Invalid min data validation Message' }),
    max: text({ ui: { description: MIN_MAX_DESCRIPTION } }),
    maxMessage: text({ label: 'Invalid max data validation Message' }),
    regEx: text({ label: 'Regular Expression' }),
    regExMessage: text({ label: 'Invalid Regular Expression match validation message' }),
    ...TIMESTAMP_SCHEMA,
  },
  hooks: {
    validate: (args) => {
      if (args.operation === 'delete') return

      const { resolvedData = {}, addValidationError } = args
      const { type, min, max } = resolvedData

      const minMaxValidator = (fieldType: 'min' | 'max', val?: string | number | null) => {
        if (!isUndefined(type) || !isUndefined(val)) {
          const value = getSchemaValue(args, fieldType)
          if (isNil(value) || value === '') return
          const typeValue = getSchemaValue(args, 'type')
          const typeSchema = FORM_VALIDATION_SCHEMA_TYPES_MAP[typeValue]

          if (['string', 'number'].includes(typeSchema)) {
            const validatedVal = Number(value)
            if (!Number.isInteger(validatedVal)) {
              addValidationError(upperFirst(`${fieldType} value must be valid integer`))
            }
            if (typeSchema === 'string' && validatedVal <= 0) {
              addValidationError(upperFirst(`${fieldType} value must be greater than 0`))
            }
          }

          if (typeSchema === 'date') {
            if (!DatePattern.test(value)) {
              addValidationError(upperFirst(`${fieldType} value must be of date pattern DD/MM/YYYY`))
            }
          }
        }
      }

      minMaxValidator('min', min)
      minMaxValidator('max', max)
    },
    afterOperation: async (data) => {
      await registerAuditLog(data)
    },
  },
  ui: {
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.FormValidation),
  },
})

export default FormValidation
