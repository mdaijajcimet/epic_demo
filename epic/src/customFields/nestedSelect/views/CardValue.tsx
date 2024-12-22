import { CardValueComponent } from '@keystone-6/core/types'
import { FieldContainer, FieldLabel } from '@keystone-ui/fields'
import React from 'react'
import { controller } from '.'

// View In displayMode: Card
export const CardValue: CardValueComponent<typeof controller> = ({ item, field }) => {
  const value = item[field.path]
  const label = field.label

  return (
    <FieldContainer>
      <FieldLabel>{label}</FieldLabel>
      {value}
    </FieldContainer>
  )
}
