import React from 'react'
import { type FieldProps } from '@keystone-6/core/types'
import { controller } from '@keystone-6/core/fields/types/checkbox/views'

import { Field as FieldWithDependency } from './views'
import { hideCheckboxKeys } from './utils'

export const Field = (props: FieldProps<typeof controller>) => {
  const hideField = hideCheckboxKeys?.[props?.field?.path]?.(props?.itemValue) || false
  return <FieldWithDependency {...props} hideField={hideField} />
}
