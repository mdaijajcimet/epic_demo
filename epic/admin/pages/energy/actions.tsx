import '@mantine/core/styles.css'
import React from 'react'

import { ImportMirn } from '../../components/Sections/energy/ImportMirn'
import Export from '../../components/Sections/Export'
import ImportOthers from '../../components/Sections/Import'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const EnergyActions = () => {
  const options = {
    Mirn: { label: 'Mirn', Component: ImportMirn },
    Import: { label: 'Import', Component: ImportOthers },
    Export: { label: 'Export', Component: Export },
  }

  return (
    <ActionWrapper
      options={options}
      actionKey="tariffCode"
      heading="Energy Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default EnergyActions
