import React, { useMemo } from 'react'
import { Heading } from '@keystone-ui/core'
import { PageContainer } from '@keystone-6/core/admin-ui/components'
import Import from '../components/Sections/Import'
import { getActionTables } from '../utils/tableActions'

const ImportData = () => {
  const actionTables = useMemo(() => getActionTables('default'), [])
  return (
    <PageContainer header={<Heading type="h3">Import Sections</Heading>}>
      <Import actionTables={actionTables} shouldRedirect />
    </PageContainer>
  )
}

export default ImportData
