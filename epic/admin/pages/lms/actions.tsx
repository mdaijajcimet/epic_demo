import '@mantine/core/styles.css'
import React from 'react'

import Export from '../../components/Sections/Export'
import Import from '../../components/Sections/Import'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const LmsVerticalActions = () => {
  const options = {
    Import: { label: 'Import', Component: Import },
    Export: { label: 'Export', Component: Export },
  }
  return (
    <ActionWrapper
      options={options}
      actionKey="lms"
      heading="LMS Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default LmsVerticalActions
