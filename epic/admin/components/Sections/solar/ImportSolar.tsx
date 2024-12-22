import React, { useState } from 'react'
import { Heading, Stack } from '@keystone-ui/core'
import { Button } from '@keystone-ui/button'
import { useToasts } from '@keystone-ui/toast'
import { Select } from '@keystone-ui/fields'
import { LoadingDots } from '@keystone-ui/loading'
import { FieldWrapper, FileUpload } from '../styles'
import { Option } from '../../../../src/types'
import { PermissionWrapper } from '../common/PermissionWrapper'
import type { ListKey } from '../../../../src/types'

const SolarData = () => {
  const { addToast } = useToasts()
  const mappedTables: Partial<Record<ListKey, Option>> = {
    SolarPanel: { label: 'Solar Panel', value: 'solar' },
    Inverter: { label: 'Inverter', value: 'inverter' },
  }
  const [tables, setTables] = useState<Option[] | null>([])
  const [selectVal, setSelectVal] = useState<Option | null>(null)
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (e.target.importFile.files && e.target.importFile.files[0]) {
      setLoading(true)
      const formData = new FormData()
      formData.append('file', e.target.importFile.files[0])
      formData.append('type', selectVal?.value || '')
      try {
        const res = await fetch('/api/import-solar', {
          method: 'POST',
          body: formData,
        })
        await res.json()
        setLoading(false)
        if (res.status === 201) {
          addToast({
            title: `Success`,
            message: 'Created Successfully!',
            tone: 'positive',
          })
          e.target.reset()
        } else if (res.status === 200) {
          addToast({
            title: `Warning`,
            message: 'Data Exist Already!',
            tone: 'help',
          })
          e.target.reset()
        } else {
          addToast({
            title: `Error`,
            message: 'Some error occurred',
            tone: 'warning',
          })
        }
      } catch (err) {
        setLoading(false)
        addToast({
          title: `Error`,
          message: 'Some error occurred',
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
    <PermissionWrapper {...{ mappedTables, options: { setTables, setSelectedTable: setSelectVal } }}>
      <Heading type="h3">Import Solar and Inverter Data</Heading>
      {tables && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack gap="medium" align="start">
            <FieldWrapper>
              <h3>Select Type:</h3>
              <Select
                id="type"
                name="type"
                value={selectVal}
                width="large"
                options={tables}
                onChange={setSelectVal}
              />
              <h3>File: </h3>
              <label style={FileUpload}>
                <input type="file" name="importFile" accept=".csv" />
              </label>
            </FieldWrapper>
            <FieldWrapper>
              <Button tone="active" weight="bold" type="submit">
                submit
              </Button>
            </FieldWrapper>
          </Stack>
          {loading ? <LoadingDots label={`Loading current color`} size="medium" /> : ''}
        </form>
      )}
    </PermissionWrapper>
  )
}

export default SolarData
