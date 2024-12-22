import React, { ReactNode } from 'react'
import { PageContainer } from '@keystone-6/core/admin-ui/components'

type LayoutProps = {
  header?: string | ReactNode
  children?: ReactNode
}

const Layout = ({ children, header }: LayoutProps) => {
  return <PageContainer header={header}>{children}</PageContainer>
}

export default Layout
