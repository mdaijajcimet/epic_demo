/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { Heading, Stack } from '@keystone-ui/core'
import { Button } from '@keystone-ui/button'
import { useToasts } from '@keystone-ui/toast'
import { LoadingDots } from '@keystone-ui/loading'
import { Select } from '@keystone-ui/fields'

import Query from '../../../graphql/queries'
import { getFilterData } from '../../../utils'
import { FieldWrapper } from '../styles'

const ExportPage = () => {
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
    getPageData(Query.pageDomain, setDomains)
    getPageData(Query.pageVertical, setVerticals)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!selectedDomain || !selectedVertical) {
      addToast({
        title: `Required Fields !!!`,
        message: 'Please Select Domain & Vertical Fields',
        tone: 'warning',
      })
      return
    }
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('table', 'Page')
    try {
      const res = await fetch('/api/export-pages', {
        method: 'POST',
        body: formData,
      })
      const { success, message, data } = await res.json()
      if (success) {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.target = '_blank'
        downloadLink.download = `${selectedDomain.value}_${selectedVertical.value}_pages.csv`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        setTimeout(() => {
          document.body.removeChild(downloadLink)
          URL.revokeObjectURL(url)
        }, 200)
      }
      setLoading(false)
      if (res.status === 200) {
        addToast({
          title: `Success`,
          message: 'Downloaded Successfully!',
          tone: 'positive',
        })
        e.target.reset()
      } else {
        addToast({
          title: `Error`,
          message,
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
  }

  return (
    <>
      <Heading type="h3">Export Pages Table Data</Heading>
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
          </FieldWrapper>
          <FieldWrapper>
            <Button tone="active" weight="bold" type="submit">
              Export Pages
            </Button>
          </FieldWrapper>
        </Stack>
        {loading ? <LoadingDots label={`Loading current color`} size="medium" /> : ''}
      </form>
    </>
  )
}

export default ExportPage
