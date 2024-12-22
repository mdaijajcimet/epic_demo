import React, { type FC } from 'react'
import { Link, useRouter } from '@keystone-6/core/admin-ui/router'
import cx from 'classnames'

import styles from './styles/custom-nav-item.module.css'

interface Props {
  href: string
  label: string
  icon?: React.ForwardRefExoticComponent<React.SVGAttributes<SVGSVGElement>>
  isSelected?: boolean
  isSubNavItem?: boolean
}

const CustomNavItem: FC<Props> = (props) => {
  const { href, label, isSelected, icon: Icon, isSubNavItem } = props
  const { pathname } = useRouter()

  return (
    <li className={styles.linkWrapper}>
      <Link
        className={cx(styles.link, {
          [`${styles[`${isSubNavItem ? 'activeSubNav' : 'active'}`]}`]:
            isSelected === undefined ? pathname === href : isSelected,
          [`${styles['subNav']}`]: isSubNavItem,
        })}
        href={href}
      >
        {Icon ? (
          <span>
            <Icon />
          </span>
        ) : null}
        <span>{label}</span>
      </Link>
    </li>
  )
}

export default CustomNavItem
