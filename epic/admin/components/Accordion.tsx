import { useRouter } from '@keystone-6/core/admin-ui/router'
import type { ListMeta } from '@keystone-6/core/types'
import cx from 'classnames'
import React, { useEffect, useState } from 'react'

import { usePermission } from '../hooks/usePermission'
import { findListItem } from '../utils/nav'
import CustomListNavItems from './CustomListNavItems'
import type { CustomNavList } from '../types/nav'
import styles from './styles/accordion.module.css'

type AccordionProps = {
  parent: React.ReactNode
  visibleLists: ListMeta[]
  customPages?: CustomNavList[]
  include?: string[]
}
export function Accordion({ parent, visibleLists, include = [], customPages }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { pathname } = useRouter()
  const { loading, error, hasAccess } = usePermission()
  const [otherLists, setOtherLists] = useState<CustomNavList[]>([])

  const isActiveAnySubNav = visibleLists.some((list) => list.path === pathname && include.includes(list.key))

  useEffect(() => {
    const listMetaItem = findListItem([...visibleLists]) as ListMeta | undefined
    const listItem = !listMetaItem && (findListItem(customPages ?? []) as CustomNavList | undefined)

    if (listItem || (listMetaItem && include.includes(listMetaItem.key))) {
      setIsExpanded(true)
    }
  }, [])

  const filteredList = include.length > 0 ? visibleLists.filter((i) => include.includes(i.key)) : visibleLists

  useEffect(() => {
    if (loading || error || !customPages?.length) return

    const filtered = customPages?.filter((page) =>
      page.access?.some((input) =>
        hasAccess({ accessModuleInput: input, permissionType: page.accessType || 'read' }),
      ),
    )

    setOtherLists(filtered)
  }, [loading, error, customPages?.length])

  const allLists = [...filteredList, ...otherLists]
  return (
    !!allLists.length && (
      <li>
        <div
          className={cx(styles.container, {
            [styles['expandedContainer']]: isActiveAnySubNav,
          })}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className={styles.title}>{parent}</div>
          <span className={styles.titleSign}>{isExpanded ? '-' : '+'}</span>
        </div>

        <ul
          className={cx(styles.list, {
            [styles.listExpanded]: isExpanded,
          })}
        >
          {isExpanded && <CustomListNavItems lists={allLists} isSubNavItem />}
        </ul>
      </li>
    )
  )
}
