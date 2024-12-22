import React from 'react'

import { Field as FieldWithDependency } from './views'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Field = (props: any) => {
  const hideField = props?.itemValue?.clickoutStatus?.value?.value?.value === 'no' ? true : false
  return <FieldWithDependency {...props} hideField={hideField} />
}
