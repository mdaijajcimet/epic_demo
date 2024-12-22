import React from 'react'
import type { FieldProps } from '@keystone-6/core/types'
import { controller } from '.'
import { ParentSingle } from '../components/ParentSingle'
import { ParentMulti } from '../components/ParentMulti'

export const Field = (props: FieldProps<typeof controller>) => {
  const { field } = props
  if (field.parentType === 'multi') return <ParentMulti {...props} />
  return <ParentSingle {...props} />
}
