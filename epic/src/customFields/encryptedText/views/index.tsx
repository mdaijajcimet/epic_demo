import { FieldController } from '@keystone-6/core/types'
import { decrypt } from '../../../utils/encryption'
import { Config, InnerTextValue, TextValue, Validation } from '../types'
import { validate } from '../../utils/validate'
import { Cell } from './Cell'

export const controller = (
  config: Config,
): FieldController<TextValue, string> & {
  displayMode: 'input'
  validation: Validation
  isNullable: boolean
} => {
  const validation: Validation = {
    isRequired: config.fieldMeta.validation.isRequired,
    length: config.fieldMeta.validation?.length ?? { min: null, max: null },
    match: config.fieldMeta.validation.match
      ? {
          regex: new RegExp(
            config.fieldMeta.validation.match.regex.source,
            config.fieldMeta.validation.match.regex.flags,
          ),
          explanation: config.fieldMeta.validation.match.explanation,
        }
      : null,
  }

  function deserializeTextValue(value: string | null): InnerTextValue {
    if (value === null) {
      return { kind: 'null', prev: '' }
    }

    try {
      return { kind: 'value', value: value ? decrypt(value) ?? value : value }
    } catch (error) {
      return { kind: 'value', value }
    }
  }

  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: { kind: 'create', inner: deserializeTextValue('') },
    displayMode: 'input',
    isNullable: config.fieldMeta.isNullable,
    deserialize: (data) => {
      const inner = deserializeTextValue(data[config.path])
      return { kind: 'update', inner, initial: inner }
    },
    serialize: (value) => ({ [config.path]: value.inner.kind === 'null' ? null : value.inner.value }),
    validation,
    validate: (val) => validate(val, validation, config.label)?.length === 0,
  }
}

Cell.supportsLinkTo = true

export { CardValue } from './CardValue'
export { Field } from './Field'
export { Cell }
