import { CellComponent } from '@keystone-6/core/types'
import { CellContainer, CellLink } from '@keystone-6/core/admin-ui/components'
import React from 'react'
import { controller } from '.'

// View In Table Index
export const Cell: CellComponent<typeof controller> = ({ field, linkTo, item }) => {
  const value = item[field.path]
  const cellStyles = {
    maxWidth: '40vw',
    maxHeight: '40vh',
    minWidth: '25ch',
    minHeight: '40px',
    overflow: 'scroll',
  }
  return linkTo ? (
    <CellLink {...linkTo} style={cellStyles}>
      {value}
    </CellLink>
  ) : (
    <CellContainer>
      <textarea style={cellStyles} readOnly value={value ?? ''}>
        {value}
      </textarea>
    </CellContainer>
  )
}
