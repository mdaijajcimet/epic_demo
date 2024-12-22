/** @jsxRuntime classic */
/** @jsx jsx */

import { CardValueComponent } from '@keystone-6/core/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'

export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  )
}
