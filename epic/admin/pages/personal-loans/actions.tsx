import '@mantine/core/styles.css'
import React from 'react'

import Copy from '../../components/Copy'
import Export from '../../components/Sections/Export'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const PLActions = () => {
  const options = {
    Mirn: { label: 'Copy', Component: Copy },
    Export: { label: 'Export', Component: Export },
  }
  return (
    <ActionWrapper
      options={options}
      actionKey="personalLoan"
      heading="Personal Loan Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default PLActions
