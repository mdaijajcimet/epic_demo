import React from 'react'
import { type FieldProps } from '@keystone-6/core/types'
import { controller } from '@keystone-6/core/fields/types/relationship/views'

import { Field as FieldWithDependency } from '../../ConditionalRelationshipField/views'
import { newScriptRelatedVerticals } from '../../../constants/verticals'
import { VerticalSlug } from '../../../types/verticals'

export const Field = (props: FieldProps<typeof controller>) => {
  const { itemValue } = props
  const verticals = (itemValue as any)?.verticals?.value?.value ?? []
  const shouldRender =
    verticals.length &&
    verticals.every((vertical: { label: VerticalSlug }) => newScriptRelatedVerticals.includes(vertical.label))

  return <FieldWithDependency {...props} shouldRender={shouldRender} />
}
