import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Heading } from '@keystone-ui/core'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React, { useMemo } from 'react'

import CopyComponent from '../components/Copy'
import { getActionTables } from '../utils/tableActions'

const Copy = () => {
  const actionTables = useMemo(() => getActionTables('default'), [])
  return (
    <MantineProvider>
      <PageContainer header={<Heading type="h3">Copy</Heading>}>
        <CopyComponent actionTables={actionTables} shouldRedirect />
      </PageContainer>
    </MantineProvider>
  )
}

export default Copy
