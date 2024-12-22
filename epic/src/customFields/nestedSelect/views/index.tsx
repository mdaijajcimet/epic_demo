/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldController } from '@keystone-6/core/types'
import type { Config, NestedOptionsValue } from '../types'
import { Cell } from './Cell'

// Entry-point of frontend
export const controller = (
  config: Config,
): FieldController<string | null, NestedOptionsValue[]> & Config['fieldMeta'] => {
  return {
    path: config.path,
    label: config.label,
    description: config.description,
    graphqlSelection: config.path,
    defaultValue: '',
    ...config.fieldMeta,
    deserialize: (data) => {
      const value = data[config.path]
      return value
    },
    serialize: (value) => ({ [config.path]: !value ? null : value }),
  }
}

Cell.supportsLinkTo = true

export { Field } from './Field'
export { CardValue } from './CardValue'
export { Cell }
