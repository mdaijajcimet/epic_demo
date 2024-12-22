import React, { useMemo } from 'react'
import { Heading } from '@keystone-ui/core'
import { PageContainer } from '@keystone-6/core/admin-ui/components'

import Export from '../components/Sections/Export'
import { getActionTables } from '../utils/tableActions'

const ExportData = () => {
  const actionTables = useMemo(() => getActionTables('default'), [])
  return (
    <PageContainer header={<Heading type="h3">Export Sections</Heading>}>
      <Export actionTables={actionTables} shouldRedirect />
    </PageContainer>
  )
}

export default ExportData
