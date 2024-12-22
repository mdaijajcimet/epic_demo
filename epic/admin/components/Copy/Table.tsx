import { gql, useLazyQuery } from '@keystone-6/core/admin-ui/apollo'
import type { ListMeta } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
import { Text } from '@keystone-ui/core'
import { LoadingDots } from '@keystone-ui/loading'
import { useToasts } from '@keystone-ui/toast'
import React, { useEffect, useState } from 'react'

import { constructSearchData, getQuery, getQueryVariables } from '../../graphql/utils'
import { useSearch } from '../../hooks/useSearch'
import { FieldWrapper } from '../Sections/styles'
import { TableData } from './TableData'
import styles from './style.module.css'

export const Table = ({ list }: { list: ListMeta & { listQueryName: string } }) => {
  const [tableData, setTableData] = useState<Array<Record<string, any>>>([])
  const { addToast } = useToasts()
  const { searchStr, Search, clearSearch } = useSearch()
  const [page, setPage] = useState(1)

  const query = getQuery(list)
  const type = list?.gqlNames.listQueryName
  const [fetchData, { loading }] = useLazyQuery(
    gql`
      ${query}
    `,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        setTableData(data?.[type] || [])

        if (!data?.[type]?.length)
          addToast({
            title: 'Info',
            message: 'No data present!',
            tone: 'help',
          })
      },
      onError: (error) => {
        addToast({
          title: error.name || 'Error',
          message: error.message,
          tone: 'negative',
        })
      },
    },
  )

  const getData = async (page: number) => {
    setPage(page)
    const whereData: Record<string, any> = searchStr ? constructSearchData(searchStr, list.fields) : {}
    fetchData({
      variables: getQueryVariables(list.key, page, whereData),
    })
  }

  useEffect(() => {
    setPage(1)
    clearSearch()
    fetchData({
      variables: getQueryVariables(list.key, 1),
    })
  }, [list.key])

  let timerId: any
  useEffect(() => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => {
      getData(1)
    }, 1000)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchStr])

  return (
    <div>
      <Search />
      {loading ? <LoadingDots label={`Loading current color`} size="medium" /> : null}
      {!loading && tableData?.length ? (
        <TableData
          {...{
            tableData,
            list,
            page,
            search: searchStr,
            fetchData,
            refetchData: () => getData(page),
          }}
        />
      ) : null}
      <FieldWrapper className={styles.selectWrapper}>
        <Button type="button" onClick={() => getData(page - 1)} isDisabled={page === 1}>
          Previous
        </Button>
        <Text as="span">Page {page}</Text>
        <Button type="button" onClick={() => getData(page + 1)} isDisabled={tableData.length === 0}>
          Next
        </Button>
      </FieldWrapper>
    </div>
  )
}
