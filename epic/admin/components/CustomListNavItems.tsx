import React, { FC } from 'react'

import { findListItem } from '../utils/nav'
import CustomNavItem from './CustomNavItem'
import type { CustomNavList } from '../types/nav'

interface Props {
  lists: CustomNavList[]
  isSubNavItem?: boolean
}

const CustomListNavItems: FC<Props> = (props) => {
  const { lists, isSubNavItem } = props

  return (
    <>
      {lists.map((list) => (
        <CustomNavItem
          key={list.key}
          href={`/${list.path}${list.isSingleton ? '/1' : ''}`}
          label={list.label}
          isSelected={!!findListItem([list])}
          isSubNavItem={isSubNavItem}
          icon={list.icon}
        />
      ))}
    </>
  )
}

export default CustomListNavItems
