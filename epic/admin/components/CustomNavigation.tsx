import type { NavigationProps } from '@keystone-6/core/admin-ui/components'
import { NavigationContainer } from '@keystone-6/core/admin-ui/components'
import { ArrowDownCircleIcon } from '@keystone-ui/icons/icons/ArrowDownCircleIcon'
import { ArrowUpCircleIcon } from '@keystone-ui/icons/icons/ArrowUpCircleIcon'
import { CopyIcon } from '@keystone-ui/icons/icons/CopyIcon'
import { GridIcon as ActionIcon } from '@keystone-ui/icons/icons/GridIcon'
import { LayoutIcon } from '@keystone-ui/icons/icons/LayoutIcon'
import cx from 'classnames'
import React from 'react'

import { LIST_ACCESS_KEY_MAP } from '../../src/config/access'
import { Accordion } from './Accordion'
import CustomNavItem from './CustomNavItem'
import styles from './styles/custom-navigation.module.css'
import { CustomNavList } from '../types/nav'
import { mappedTables as importMappedTables } from '../constants/config'
import { copyAllowedTablesMap } from './Copy/config'
import { getActionTables } from '../utils/tableActions'
import { PermissionWrapper } from './Sections/common/PermissionWrapper'

type NavGroups = {
  title: string
  include: string[]
  list?: CustomNavList[]
}

const navGroups: NavGroups[] = [
  {
    title: 'Credit Cards',
    include: ['CreditCard', 'ProviderCreditCard', 'CCFormContainer', 'CCUploadGroup'],
    list: [
      {
        path: 'credit-cards/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.CreditCard],
        accessType: 'read',
      },
    ],
  },
  {
    title: 'Personal Loan',
    include: ['PLProvider', 'PersonalLoan', 'PLFormContainer'],
    list: [
      {
        path: 'personal-loans/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.PersonalLoan],
        accessType: 'read',
      },
    ],
  },
  {
    title: 'Solar',
    include: [
      'AddonFeature',
      'Battery',
      'BundleFeature',
      'Installer',
      'InstallerAddon',
      'InstallerBattery',
      'InstallerContact',
      'InstallerInverter',
      'InstallerLicence',
      'InstallerSolarPanel',
      'InstallerZone',
      'Inverter',
      'Manufacturer',
      'SolarAddon',
      'SolarAffiliate',
      'SolarBundle',
      'SolarPanel',
      'StateWiseRebate',
    ],
    list: [
      {
        path: 'solar/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.SolarBundle],
        accessType: 'read',
      },
    ],
  },
  {
    title: 'Health Insurance',
    include: [
      'HIRebate',
      'HIProvider',
      'HIFormContainer',
      'ProductTier',
      'HospitalCover',
      'ExtrasCover',
      'PaymentFrequency',
    ],
    list: [
      {
        path: 'health-insurance/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.HIProvider],
        accessType: 'read',
      },
    ],
  },
  {
    title: 'Bundle',
    include: ['BundleFormContainer'],
  },
  {
    title: 'Form Elements',
    include: ['FormComponent', 'FormField', 'FormOption', 'FormValidation'],
  },
  {
    title: 'Pages',
    include: [
      'Domain',
      'DomainConfig',
      'Page',
      'PageConfig',
      'Redirect',
      'Section',
      'Tag',
      'Widget',
      'Link',
      'LinkGroup',
    ],
    list: [
      {
        path: 'pages/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.Page],
      },
    ],
  },
  {
    title: 'Affiliates',
    include: ['Affiliate', 'SubAffiliate'],
  },
  {
    title: 'LMS',
    include: ['Provider', 'Plan', 'Addon', 'AddonField'],
    list: [
      {
        path: 'lms/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.Provider],
        accessType: 'read',
      },
    ],
  },
  {
    title: 'Energy',
    include: ['Mirn', 'TariffCode'],
    list: [
      {
        path: 'energy/actions',
        label: 'Actions',
        icon: ActionIcon,
        access: [LIST_ACCESS_KEY_MAP.Mirn, LIST_ACCESS_KEY_MAP.TariffCode],
        accessType: 'read',
      },
      {
        key: 'open-energy-bill-rules',
        path: '/open-energy/open-energy-bill-rules',
        label: 'OE bill rules',
        icon: undefined,
        access: [LIST_ACCESS_KEY_MAP.OpenEnergyBillRule],
        accessType: 'read',
      },
    ],
  },
  {
    title: 'UI Elements',
    include: ['Attribute', 'Component', 'Container', 'Field', 'Filter', 'CustomAttribute'],
  },
  {
    title: 'Upload Documents',
    include: ['UploadCategory', 'UploadDocument'],
  },
  {
    title: 'Ignore Data',
    include: ['IgnoreList', 'IgnoreParameter', 'IgnoreType'],
  },
  {
    title: 'Common',
    include: ['CreditScore', 'Media'],
  },
  {
    title: 'Others',
    include: ['CsSite', 'Vertical', 'Script', 'Member', 'PasswordSetting'],
  },
]

const generalTables = getActionTables('default')

const isolatedCustomPages: (CustomNavList & { mappedTables: any; actionTables: any })[] = [
  {
    key: 'import',
    path: '/import',
    label: 'Import Data',
    icon: ArrowDownCircleIcon,
    mappedTables: importMappedTables,
    actionTables: generalTables,
  },
  {
    key: 'export',
    path: '/export',
    label: 'Export Data',
    icon: ArrowUpCircleIcon,
    mappedTables: generalTables,
    actionTables: generalTables,
    accessType: 'read',
  },
  {
    key: 'copy',
    path: '/copy',
    label: 'Copy Data',
    icon: CopyIcon,
    mappedTables: copyAllowedTablesMap,
    actionTables: generalTables,
  },
]
export function CustomNavigation({ lists, authenticatedItem }: NavigationProps) {
  return (
    <NavigationContainer authenticatedItem={authenticatedItem}>
      <hr className={cx(styles.divider, styles.navAuthenticateDivider)} />
      <CustomNavItem href="/" label="Dashboard" icon={LayoutIcon} />
      {!!lists.length && (
        <>
          {isolatedCustomPages.map(({ mappedTables, actionTables, accessType, ...page }) => (
            <PermissionWrapper
              mappedTables={mappedTables}
              actionTables={actionTables}
              permissionType={accessType}
              options={{ showNoAccessMsg: false }}
            >
              <CustomNavItem href={page.path} {...page} />
            </PermissionWrapper>
          ))}
          <hr className={styles.divider} />
          {navGroups.map((category, i) => (
            <Accordion
              key={i}
              parent={category.title}
              visibleLists={lists}
              include={category.include}
              customPages={category.list}
            />
          ))}
        </>
      )}
    </NavigationContainer>
  )
}
