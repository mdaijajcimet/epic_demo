/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Heading, Stack } from '@keystone-ui/core'
import { Button } from '@keystone-ui/button'
import { useToasts } from '@keystone-ui/toast'
import { LoadingDots } from '@keystone-ui/loading'
import { Select } from '@keystone-ui/fields'

import Query from '../../../graphql/queries'
import { getFilterData } from '../../../utils'
import { FieldWrapper, FileUpload } from '../styles'
import { PermissionWrapper } from '../common/PermissionWrapper'

const ImportPage = () => {
  const { addToast } = useToasts()

  const [loading, setLoading] = useState(false)

  const [domains, setDomains] = useState<any>(null)
  const [selectedDomain, setSelectedDomain] = useState<any>(null)

  const [verticals, setVerticals] = useState<any>(null)
  const [selectedVertical, setSelectedVertical] = useState<any>(null)

  const getPageData = async (query: any, setter: any) => {
    const result = await getFilterData(query)
    setter(result)
  }

  useEffect(() => {
    getPageData(Query.domains, setDomains)
    getPageData(Query.verticalName, setVerticals)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!selectedDomain || !selectedVertical) {
      addToast({
        title: `Required Fields !!!`,
        message: 'Please Select Domain & Vertical',
        tone: 'warning',
      })
      return
    }
    if (e.target.file.files && e.target.file.files[0]) {
      setLoading(true)
      const formData = new FormData(e.currentTarget)
      formData.append('table', 'Page')
      try {
        const res = await fetch('/api/import-pages', {
          method: 'POST',
          body: formData,
        })
        await res.json()
        setLoading(false)
        if (res.status === 200) {
          addToast({
            title: `Success`,
            message: 'Created Successfully!',
            tone: 'positive',
          })
          e.target.reset()
        } else if (res.status === 201) {
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
        message: 'Please Select File Data',
        tone: 'warning',
      })
    }
  }

  return (
    <PermissionWrapper mappedTables={['Page']}>
      <Heading type="h3">Import Pages Table Data</Heading>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Stack gap="medium" align="start">
          <FieldWrapper>
            <h3>Select Domain :</h3>
            <Select
              id="domain"
              name="domain"
              value={selectedDomain}
              width="large"
              options={domains}
              onChange={setSelectedDomain}
            />

            <h3>Select Vertical :</h3>
            <Select
              id="vertical"
              name="vertical"
              value={selectedVertical}
              width="large"
              options={verticals}
              onChange={setSelectedVertical}
            />

            <h3>Select File: </h3>
            <label style={FileUpload}>
              <input type="file" name="file" accept=".csv" />
            </label>
          </FieldWrapper>
          <FieldWrapper>
            <Button tone="active" weight="bold" type="submit">
              Import Pages
            </Button>
          </FieldWrapper>
        </Stack>
        {loading ? <LoadingDots label={`Loading current color`} size="medium" /> : ''}
      </form>
    </PermissionWrapper>
  )
}

export default ImportPage
