import '@mantine/core/styles.css'
import React from 'react'

import Copy from '../../components/Copy'
import Export from '../../components/Sections/Export'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const HIActions = () => {
  const options = {
    Mirn: { label: 'Copy', Component: Copy },
    Export: { label: 'Export', Component: Export },
  }
  return (
    <ActionWrapper
      options={options}
      actionKey="healthInsurance"
      heading="Health Insurance Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default HIActions
