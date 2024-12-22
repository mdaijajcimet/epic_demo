import {
  ApolloError,
  LazyQueryExecFunction,
  OperationVariables,
  gql,
  useMutation,
} from '@keystone-6/core/admin-ui/apollo'
import { useKeystone } from '@keystone-6/core/admin-ui/context'
import type { ListMeta } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { Checkbox } from '@keystone-ui/fields'
import { CopyIcon, Trash2Icon } from '@keystone-ui/icons'
import { LoadingDots } from '@keystone-ui/loading'
import { useToasts } from '@keystone-ui/toast'
import { Table } from '@mantine/core'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import React, { useMemo, useState } from 'react'

import { constructSearchData, getQuery, getQueryVariables } from '../../graphql/utils'
import { getConnectedLists, getStringValue, sanitizeDataForCopy } from '../../utils'
import { FieldWrapper } from '../Sections/styles'
import { copyOrderKeys } from './config'
import styles from './style.module.css'

type Actions = 'copy' | 'delete'

export const TableData = ({
  tableData,
  list,
  page,
  search,
  fetchData,
  refetchData,
}: {
  tableData: Record<string, any>[]
  list: ListMeta & { listQueryName: string }
  page: number
  search: string
  fetchData: LazyQueryExecFunction<any, OperationVariables>
  refetchData: () => void
}) => {
  const [selectedData, setSelectedData] = useState<Record<string, Record<string, any> | null>>({})
  const { addToast } = useToasts()
  const { adminMeta } = useKeystone()
  const { lists } = adminMeta
  const connectedLists = useMemo(() => getConnectedLists(lists, list), [list.key])

  const fields = list.fields || []
  const copyQuery = getQuery(list, 'create')
  const deleteQuery = getQuery(list, 'delete')
  const checkedArr = Object.keys(selectedData).filter((key) => selectedData[key])

  const itemSelectionChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: Record<string, any>,
  ) => {
    if (event.target.checked) {
      setSelectedData((prev) => ({ ...prev, [item?.id]: item }))
    } else {
      setSelectedData((prev) => ({ ...prev, [item?.id]: null }))
    }
  }

  const successCb = (type: Actions) => {
    setSelectedData({})
    addToast({
      title: 'Success',
      message: `${type} successful!`,
      tone: 'positive',
    })
    fetchData({
      variables: getQueryVariables(list.key, page, constructSearchData(search, list.fields)),
      fetchPolicy: 'cache-and-network',
    })
  }

  const errorCb = (error: ApolloError) => {
    addToast({
      title: error.name || 'Error',
      message: error.message,
      tone: 'negative',
    })
  }

  const [copyItems, { loading: copyLoading }] = useMutation(
    gql`
      ${copyQuery}
    `,
    {
      onCompleted: () => {
        successCb('copy')
      },
      onError: (error) => errorCb(error),
    },
  )

  const [deleteItems, { loading: deleteLoading }] = useMutation(
    gql`
      ${deleteQuery}
    `,
    {
      onCompleted: async () => {
        successCb('delete')
        await refetchData()
      },
      onError: (error) => errorCb(error),
      awaitRefetchQueries: true,
    },
  )

  const handleProcess = (e: React.MouseEvent<HTMLButtonElement>, type: Actions = 'copy') => {
    if (copyLoading || deleteLoading) {
      addToast({
        title: 'Error',
        message: `${copyLoading ? 'Copy' : 'Delete'} in progress`,
        tone: 'negative',
      })
      return
    }
    const compactItems = !isEmpty(selectedData) ? compact(Object.values(selectedData)) : []

    if (isEmpty(compactItems)) {
      addToast({
        title: 'Error',
        message: `Nothing to ${type}!`,
        tone: 'negative',
      })
      return
    }
    if (type === 'copy') {
      const data = sanitizeDataForCopy(compactItems, list, connectedLists)
      copyItems({ variables: { data } })
    }
    if (type === 'delete') {
      const where = compactItems.map((item) => ({ id: item?.id }))
      deleteItems({ variables: { where } })
    }
  }

  const orderField = copyOrderKeys[list.key]
  const renderHeadings = () => (
    <Table.Tr key="heading">
      <Table.Th key="check"></Table.Th>
      <Table.Th key="id">ID</Table.Th>
      {fields[orderField] ? <Table.Th key={orderField}>{fields[orderField]?.label}</Table.Th> : null}
      {!list.initialColumns.includes(list.labelField) ? (
        <Table.Th key={orderField}>{fields[list.labelField]?.label}</Table.Th>
      ) : null}
      {list.initialColumns.map((key) =>
        key === 'id' || key === orderField ? null : (
          <Table.Th key={fields[key]?.label}>{fields[key]?.label}</Table.Th>
        ),
      )}
    </Table.Tr>
  )

  const renderData = () => {
    const foreignFields = Object.values(fields).reduce((acc: Record<string, any>, field) => {
      const fieldMeta = field.fieldMeta
      if (typeof fieldMeta === 'object' && fieldMeta !== null && 'refListKey' in fieldMeta)
        return { ...acc, [field.path]: fieldMeta.refLabelField }
      return acc
    }, {})
    return tableData.map((item) => (
      <Table.Tr key={item?.id}>
        <Table.Td key={item.id + 'check'}>
          <Checkbox
            type="checkbox"
            name="check"
            value={item?.id}
            checked={checkedArr.includes(item?.id)}
            onChange={(e) => itemSelectionChangeHandler(e, item)}
            children=""
            size="medium"
          />
        </Table.Td>
        <Table.Td key={item.id + 'id'}>
          <a href={list.path + '/' + item.id}>{item.id}</a>
        </Table.Td>
        {fields[orderField] ? <Table.Td key={orderField}>{item[orderField]}</Table.Td> : null}
        {!list.initialColumns.includes(list.labelField) ? (
          <Table.Td key={orderField}>{getStringValue(item, list.labelField, foreignFields)}</Table.Td>
        ) : null}
        {list.initialColumns.map((key) =>
          key === 'id' || key === orderField ? null : (
            <Table.Td key={item?.id + key}>{getStringValue(item, key, foreignFields)}</Table.Td>
          ),
        )}
      </Table.Tr>
    ))
  }

  return (
    <div>
      <FieldWrapper className={styles.selectWrapper}>
        <Button
          tone="active"
          weight="bold"
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleProcess(e, 'copy')}
          isDisabled={copyLoading}
        >
          Copy <CopyIcon size="small" />
        </Button>
        <Button
          tone="negative"
          weight="none"
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleProcess(e, 'delete')}
          isDisabled={deleteLoading}
        >
          Delete <Trash2Icon size="small" color="red" />
        </Button>
        {copyLoading || deleteLoading ? <LoadingDots label={`Loading current color`} size="medium" /> : ''}
      </FieldWrapper>
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        horizontalSpacing="md"
        verticalSpacing="xs"
        stickyHeader
        captionSide="top"
      >
        <Table.Caption style={{ textAlign: 'left' }}>
          <h4>
            Showing {tableData.length} {list.plural}
          </h4>
        </Table.Caption>
        <Table.Thead>{renderHeadings()}</Table.Thead>
        <Table.Tbody>{renderData()}</Table.Tbody>
      </Table>
    </div>
  )
}
