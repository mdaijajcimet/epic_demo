import React from 'react'

import Export from '../../components/Sections/Export'
import ImportOthers from '../../components/Sections/Import'
import ImportSpecific from '../../components/Sections/solar/ImportSolar'
import { ActionWrapper } from '../../components/TableActions/ActionWrapper'

const SolarActions = () => {
  const options = {
    ImportSpecific: { label: 'Import Solar Panel / Inverter', Component: ImportSpecific },
    Import: { label: 'Import', Component: ImportOthers },
    Export: { label: 'Export', Component: Export },
  }

  return (
    <ActionWrapper
      options={options}
      actionKey="solar"
      heading="Solar Actions"
      initialSelection={options.Export.label}
    />
  )
}

export default SolarActions
