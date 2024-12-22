/* eslint-disable @typescript-eslint/no-explicit-any */
import { useKeystone } from '@keystone-6/core/admin-ui/context'
import { Button } from '@keystone-ui/button'
import { Heading, Stack } from '@keystone-ui/core'
import { Select } from '@keystone-ui/fields'
import { LoadingDots } from '@keystone-ui/loading'
import { useToasts } from '@keystone-ui/toast'
import get from 'lodash/get'
import React, { useEffect, useState } from 'react'

import { Option } from '../../../src/types'
import {
  ImportTablesMap,
  TARIFF_CODE_TABLE_NAME,
  TARIFF_CODE_VERTICALS,
  mappedTables,
} from '../../constants/config'
import type { CommonActionProps } from '../../types/tableActions'
import { getFieldData } from '../../utils'
import { PermissionWrapper } from './common/PermissionWrapper'
import { FieldWrapper, FileUpload, HR } from './styles'

const ImportData = ({ actionTables, shouldRedirect = false }: CommonActionProps) => {
  const { addToast } = useToasts()
  const { adminMeta } = useKeystone()
  const [tables, setTables] = useState<Option[] | null>([])

  const { lists = {} as any } = adminMeta
  const [loading, setLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState<Option | null>(null)
  const [mappedTableData, setMappedTableData] = useState<ImportTablesMap | null>(null)
  const verticalOptions = TARIFF_CODE_VERTICALS.map((v: string) => ({ label: v, value: v }))
  const [vertical, setVertical] = useState<(typeof verticalOptions)[0] | null>(verticalOptions[0])

  useEffect(() => {
    if (selectedTable) setMappedTableData(mappedTables[selectedTable?.value])
  }, [selectedTable])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const fields = get(lists, `${selectedTable?.value}.fields`, [])

    const { primitiveFields, relationshipFields } = getFieldData(fields)

    if (e.target.file.files && e.target.file.files[0]) {
      setLoading(true)
      const formData = new FormData(e.currentTarget)
      formData.append('primitiveFields', JSON.stringify(primitiveFields))
      formData.append('filterKeys', JSON.stringify(mappedTableData?.filterKeys))
      formData.append('requiredFields', JSON.stringify(mappedTableData?.requiredFields))
      formData.append('relationshipFields', JSON.stringify(relationshipFields))

      let IMPORT_ENDPOINT = '/api/import-data'
      if (selectedTable?.label === TARIFF_CODE_TABLE_NAME) {
        IMPORT_ENDPOINT = '/api/import-tariff-codes'
      }
      try {
        const res = await fetch(IMPORT_ENDPOINT, {
          method: 'POST',
          body: formData,
        })
        const { message } = await res.json()
        setLoading(false)
        if (res.status === 201) {
          addToast({
            title: `Success`,
            message: message || 'Created Successfully!',
            tone: 'positive',
          })
          e.target.reset()
        } else if (res.status === 200) {
          addToast({
            title: `Warning`,
            message: message || 'Data Exist Already!',
            tone: 'help',
          })
          e.target.reset()
        } else {
          addToast({
            title: `Error`,
            message: message || 'Some error occurred',
            tone: 'warning',
          })
        }
      } catch (err: any) {
        setLoading(false)
        addToast({
          title: `Error`,
          message: err?.message || 'Some error occurred',
          tone: 'negative',
        })
      }
    } else {
      addToast({
        title: `Warning`,
        message: 'Please select correct data',
        tone: 'warning',
      })
    }
  }

  return (
    <PermissionWrapper
      {...{ options: { setSelectedTable, setTables, shouldRedirect }, mappedTables, actionTables }}
    >
      <Heading type="h3">Import Any Table Data</Heading>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {tables && (
          <Stack gap="medium" align="start">
            <FieldWrapper>
              <h3>Select Table:</h3>
              <Select
                id="table"
                name="table"
                value={selectedTable ?? tables[0]}
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
              <h3>File: </h3>
              <label style={FileUpload}>
                <input type="file" name="file" accept=".csv" />
              </label>
            </FieldWrapper>
            <FieldWrapper>
              <Button tone="active" weight="bold" type="submit">
                Import
              </Button>
            </FieldWrapper>
          </Stack>
        )}
        {loading ? <LoadingDots label={`Loading current color`} size="medium" /> : ''}
      </form>
      <hr style={HR} />
    </PermissionWrapper>
  )
}

export default ImportData
