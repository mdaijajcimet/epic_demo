/* eslint-disable @typescript-eslint/no-explicit-any */
import { useKeystone } from '@keystone-6/core/admin-ui/context'
import { Button } from '@keystone-ui/button'
import { Heading, Stack } from '@keystone-ui/core'
import { Select } from '@keystone-ui/fields'
import { LoadingDots } from '@keystone-ui/loading'
import { useToasts } from '@keystone-ui/toast'
import get from 'lodash/get'
import React, { useEffect, useState } from 'react'

import type { ListKey } from '../../../src/types'
import { Option } from '../../../src/types'
import config, { TARIFF_CODE_TABLE_NAME, TARIFF_CODE_VERTICALS } from '../../constants/config'
import type { CommonActionProps } from '../../types/tableActions'
import { getFieldData, getFilterData } from '../../utils'
import { PermissionWrapper } from './common/PermissionWrapper'
import { FieldWrapper, HR } from './styles'

const Export = ({ actionTables, shouldRedirect = false }: CommonActionProps) => {
  const { addToast } = useToasts()
  const { adminMeta, visibleLists } = useKeystone()
  const { lists = {} as any } = adminMeta

  const [tables, setTables] = useState<Option[] | null>([])

  const [loading, setLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Option | null>(null)
  const [filters, setFilters] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState<any>(null)
  const [subFilters, setSubFilters] = useState<any>(null)
  const [selectedSubFilter, setSelectedSubFilter] = useState<any>(null)
  const verticalOptions = TARIFF_CODE_VERTICALS.map((v: string) => ({ label: v, value: v }))
  const [vertical, setVertical] = useState<(typeof verticalOptions)[0] | null>(null)

  const getSubFilters = async (query: any) => {
    const generateFilters = await getFilterData(query)
    setSubFilters(generateFilters)
    setSelectedSubFilter(generateFilters?.[0])
  }

  useEffect(() => {
    if (selectedTable) setFilters(config[selectedTable.value]?.filters)
  }, [selectedTable])

  useEffect(() => {
    setSelectedFilter(filters?.[0])
  }, [filters])

  useEffect(() => {
    if (selectedFilter) {
      getSubFilters(selectedFilter)
    }
  }, [selectedFilter])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (!selectedTable) return
    const fields = get(lists, `${selectedTable.value}.fields`, [])

    const { primitiveFields, relationshipFields } = getFieldData(fields)

    const formData = new FormData(e.currentTarget)
    formData.append('primitiveFields', JSON.stringify(primitiveFields))
    formData.append('relationshipFields', JSON.stringify(relationshipFields))
    if (selectedFilter && selectedSubFilter) {
      formData.set('filters', JSON.stringify(selectedFilter.variables(selectedSubFilter.value)))
    }
    let IMPORT_ENDPOINT = '/api/export-data'
    if (selectedTable.label === TARIFF_CODE_TABLE_NAME) {
      IMPORT_ENDPOINT = '/api/export-tariff-codes'
    }
    try {
      const res = await fetch(IMPORT_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
      const { success, data, message, filename = '' } = await res.json()
      if (success) {
        const downloadLink = document.createElement('a')
        downloadLink.href = `data:text/csv;charset=utf-8,${encodeURI(data)}`
        downloadLink.target = '_blank'
        downloadLink.download = filename || `${selectedTable.value}.csv`
        downloadLink.click()
      }
      setLoading(false)
      if (res.status === 200) {
        addToast({
          title: `Success`,
          message: 'Downloaded Successfully!',
          tone: 'positive',
        })
        e.target.reset()
        return
      }
      addToast({
        title: `Error`,
        message: message || 'Some error occurred',
        tone: 'warning',
      })
    } catch (err: any) {
      setLoading(false)
      addToast({
        title: `Error`,
        message: err?.message || 'Some error occurred',
        tone: 'negative',
      })
    }
  }

  return (
    <PermissionWrapper
      {...{
        actionTables,
        mappedTables: visibleLists.state === 'loaded' ? ([...visibleLists.lists] as ListKey[]) : [],
        options: { setSelectedTable, setTables, shouldRedirect },
        permissionType: 'read',
      }}
    >
      <Heading type="h3">Export Any Table Data</Heading>
      {!!tables && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack gap="medium" align="start">
            <FieldWrapper>
              <h3>Select Table:</h3>
              <Select
                id="table"
                name="table"
                value={selectedTable || tables?.[0]}
                width="large"
                options={tables}
                onChange={setSelectedTable}
              />
              {selectedTable?.value === TARIFF_CODE_TABLE_NAME && (
                <>
                  <h4>Select Vertical:</h4>
                  <Select
                    id="vertical"
                    name="vertical"
                    value={vertical}
                    width="large"
                    options={verticalOptions}
                    onChange={setVertical}
                  />
                </>
              )}
              {filters ? (
                <>
                  <h3>Select Filters:</h3>
                  <Select
                    id="filters"
                    name="filters"
                    value={selectedFilter}
                    width="large"
                    options={filters}
                    onChange={setSelectedFilter}
                  />
                </>
              ) : null}

              {selectedFilter && subFilters ? (
                <>
                  <h3>Select Sub-Filters:</h3>
                  <Select
                    id="subFilters"
                    name="subFilters"
                    value={selectedSubFilter}
                    width="large"
                    options={subFilters}
                    onChange={setSelectedSubFilter}
                  />
                </>
              ) : null}
            </FieldWrapper>
            <FieldWrapper>
              <Button tone="active" weight="bold" type="submit" disabled={!selectedTable}>
                Export
              </Button>
            </FieldWrapper>
          </Stack>
          {loading ? <LoadingDots label={`Loading current color`} size="medium" /> : ''}
        </form>
      )}
      <hr style={HR} />
    </PermissionWrapper>
  )
}

export default Export
