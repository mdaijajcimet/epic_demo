import '@mantine/core/styles.css'
import React from 'react'

import Export from '../../components/Sections/pages/ExportPage'
import Import from '../../components/Sections/pages/ImportPage'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const PageActions = () => {
  const options = {
    Import: { label: 'Import', Component: Import },
    Export: { label: 'Export', Component: Export },
  }

  return (
    <ActionWrapper
      options={options}
      actionKey={'pages'}
      heading="Page Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default PageActions
