/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteIcon } from '@keystone-ui/icons/icons/DeleteIcon'
import { Table } from '@mantine/core'
import { capitalize, difference, every, filter, isEmpty, isNull, map, omit } from 'lodash'
import Link from 'next/link'
import React from 'react'

export const renderTableHeadings = (headers = [] as string[]) => (
  <Table.Tr key="heading">
    {headers?.map((key: string) => (
      <Table.Th key={key}>{capitalize(key)}</Table.Th>
    ))}
  </Table.Tr>
)

export const renderTableData = (
  tableData = [] as any,
  headers = [] as string[],
  key = 'id',
  options: Record<string, any>,
) => {
  const { path, hasDelete = false, handleRowDelete } = options
  return tableData?.map((item: Record<string, any>) => (
    <Table.Tr key={item?.[key]}>
      {headers?.map((headerKey: string) =>
        headerKey === key ? (
          <Table.Td key={headerKey + '_id'}>
            <Link href={`${path}/${item?.[key]}`}>{item?.[key]}</Link>
          </Table.Td>
        ) : (
          <Table.Td key={key + '_' + headerKey} style={{ maxWidth: '150px', overflow: 'auto' }}>
            {item?.[headerKey]}
          </Table.Td>
        ),
      )}
      {hasDelete ? (
        <Table.Td style={{ borderTop: '1px dotted red' }} onClick={() => handleRowDelete(item?.id)}>
          <DeleteIcon />
        </Table.Td>
      ) : null}
    </Table.Tr>
  ))
}

const isColumnEmpty = (columnName: string, data: Record<string, any>) => {
  return every(data, (row) => isNull(row[columnName]) || isEmpty(row[columnName]))
}

export const filterTableFields = (data: Record<string, any>, headers: string[]) => {
  const columnsToRemove = filter(headers, (header) => isColumnEmpty(header, data))
  const updatedTableData = map(data, (row) => {
    return omit(row, columnsToRemove)
  })
  const updatedHeaders = difference(headers, columnsToRemove)
  return { tableData: updatedTableData, tableHeaders: updatedHeaders }
}
