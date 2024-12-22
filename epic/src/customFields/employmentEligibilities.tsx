import React from 'react'
import { JsonTable } from './Common/JsonTable'
import fetchEpicAPI from '../libs/fetchEpicAPI'
import { JsonTableData } from './Common/JsonTable/typeDefs'
import { JsonFieldProps } from './typeDefs'
import { getFormOptionKeyDesc } from '../utils/schemas'
import { FORM_OPTION_KEYS } from '../constants/schema'

export const Field = (props: JsonFieldProps) => {
  const fields: JsonTableData = [
    {
      name: 'type',
      element: 'select',
      getOptions: async () => {
        const query = {
          table: 'formOption',
          where: { key: { equals: FORM_OPTION_KEYS.EMP_ELIGIBILITY_TYPES, mode: 'insensitive' } },
        }
        const data = await fetchEpicAPI('/api/table-data', query)
        return (data?.success && data?.data?.[0]?.options) || []
      },
      isRequired: true,
      description: getFormOptionKeyDesc(FORM_OPTION_KEYS.EMP_ELIGIBILITY_TYPES),
    },
    {
      name: 'minDuration',
      label: 'Min Duration in months',
      type: 'number',
      tableHeader: 'Min Duration',
      tableValueFormatter: (val) => `${val} Month`,
    },
    {
      name: 'eligible',
      element: 'checkbox',
      defaultValue: true,
      tableHeader: 'Eligibility',
      tableValueFormatter: (val) => (val ? 'Eligible' : 'Not Eligible'),
    },
  ]

  return <JsonTable {...props} fields={fields} />
}
