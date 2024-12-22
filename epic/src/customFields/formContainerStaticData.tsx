import React from 'react'
import { JsonTable } from './Common/JsonTable'
import { JsonTableData } from './Common/JsonTable/typeDefs'
import { JsonFieldProps } from './typeDefs'

export const Field = (props: JsonFieldProps) => {
  const fields: JsonTableData = [
    {
      name: 'slug',
      element: 'input',
      type: 'text',
      isRequired: true,
      description: `Give the key for the text field`,
    },
    {
      name: 'value',
      label: 'value',
      element: 'input',
      type: 'text',
      isRequired: true,
      tableHeader: 'Value',
    },
  ]

  return <JsonTable {...props} fields={fields} />
}
