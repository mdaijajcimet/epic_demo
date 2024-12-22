import '@mantine/core/styles.css'
import React from 'react'

import Copy from '../../components/Copy'
import Export from '../../components/Sections/Export'
import Import from '../../components/Sections/Import'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const CCActions = () => {
  const options = {
    Mirn: { label: 'Copy', Component: Copy },
    Import: { label: 'Import', Component: Import },
    Export: { label: 'Export', Component: Export },
  }
  return (
    <ActionWrapper
      options={options}
      actionKey="creditCards"
      heading="Credit Card Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default CCActions
