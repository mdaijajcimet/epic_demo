/** @jsxRuntime classic */
/** @jsx jsx */

import { CellContainer, CellLink } from '@keystone-6/core/admin-ui/components'
import { CellComponent } from '@keystone-6/core/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'

export const Cell: CellComponent = ({ item, field, linkTo }) => {
  const value = item[field.path] ? 'password set' : 'empty'
  return linkTo ? <CellLink {...linkTo}>{value}</CellLink> : <CellContainer>{value}</CellContainer>
}
