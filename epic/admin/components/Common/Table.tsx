/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { Table as MantineTable } from '@mantine/core'

import { renderTableHeadings, renderTableData, filterTableFields } from './utils'

const Table = ({ data, headers, ...rest }: Record<string, any>) => {
  if (isEmpty(data)) return null
  const { pathLink } = rest
  const router = useRouter()
  const { asPath } = router
  const path = pathLink || asPath

  const { tableData, tableHeaders } = filterTableFields(data, headers)

  return (
    <MantineTable
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      horizontalSpacing="md"
      verticalSpacing="xs"
    >
      <MantineTable.Thead>{renderTableHeadings(tableHeaders)}</MantineTable.Thead>
      <MantineTable.Tbody>
        {renderTableData(tableData, tableHeaders, 'id', { ...rest, path })}
      </MantineTable.Tbody>
    </MantineTable>
  )
}

export default Table
