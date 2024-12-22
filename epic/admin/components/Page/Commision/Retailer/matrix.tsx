/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { isEmpty, without } from 'lodash'
import { LoadingDots } from '@keystone-ui/loading'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { useRouter } from '@keystone-6/core/admin-ui/router'
import { Heading } from '@keystone-ui/core'

import Layout from '../../../Layout'
import useRetailerData from '../../../../hooks/useRetailerData'
import FilterRetailer from '../../../FinancialMatrix/FilterRetailer'
import { structureMatrixData, flatRetailerData, getRetailerHeaders } from '../../../../utils/financialMatrix'
import ListRetailer from '../../../FinancialMatrix/ListRetailer'
import AuditLog from '../../../Common/AuditLog'
import { CommisionHeader, generateRetailerFilters } from '../../../FinancialMatrix/utils'
import CreateRetailer from '../../../FinancialMatrix/CreateRetailer'
import '../styles.css'

const RetailerMatrix = () => {
  const {
    query: { id },
  } = useRouter()
  const [tableData, setTableData] = useState<any>([])
  const [filterData, setFilterData] = useState<any>({})
  const table = 'RetailerMatrix'
  const { providerName, data, loading, error, deleteRetailerMatrix } = useRetailerData(
    id as string,
    filterData as any,
  )
  useEffect(() => {
    if (data?.retailerMatrices) {
      setTableData(data.retailerMatrices)
    }
  }, [data])

  if (loading) return <LoadingDots label="Loading Retailer Matrix" size="medium" />
  if (error) return null
  const header = (
    <CommisionHeader providerName={providerName} hasCreate>
      <CreateRetailer setTableData={setTableData} />
    </CommisionHeader>
  )
  const docIds = tableData?.map((item: { id: string }) => item?.id) || []
  const retailerAuditFilters = generateRetailerFilters(id as string, docIds)
  const emptyData = isEmpty(tableData) && isEmpty(filterData)
  const { filters, groups, vertical } = structureMatrixData(flatRetailerData(tableData))
  const headers = getRetailerHeaders(vertical, without(groups, 'others'))
  return (
    <MantineProvider>
      <Layout header={header}>
        {emptyData ? (
          <Heading type="h2" textAlign="center">
            Nothing to Show!
          </Heading>
        ) : (
          <>
            <FilterRetailer filterData={filterData} setFilterData={setFilterData} />
            <ListRetailer
              groups={groups}
              filters={filters}
              headers={headers}
              deleteRetailerMatrix={deleteRetailerMatrix}
              tableData={tableData}
              setTableData={setTableData}
            />
          </>
        )}
        <AuditLog table={table} variables={retailerAuditFilters} />
      </Layout>
    </MantineProvider>
  )
}

export default RetailerMatrix
