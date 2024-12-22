/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'
import { Button } from '@keystone-ui/button'
import { Heading, Stack } from '@keystone-ui/core'
import { LoadingDots } from '@keystone-ui/loading'
import { useToasts } from '@keystone-ui/toast'
import { Table } from '@mantine/core'
import axios from 'axios'
import React, { useMemo, useState } from 'react'

import fetchEpicAPI from '../../../../src/libs/fetchEpicAPI'
import type { AllPermissionsVal } from '../../../../src/types/access'
import { utcToAest } from '../../../../src/utils/dayjs'
import { CREATE_MIRN, GET_MIRN } from '../../../graphql/queries/Page/importMirn'
import { usePermission } from '../../../hooks/usePermission'
import { PermissionWrapper } from '../common/PermissionWrapper'
import { FieldWrapper, FileUpload } from '../styles'

const EXPORT_ENDPOINT = '/api/export-mirn'
const DELETE_ENDPOINT = '/api/delete-mirn'
const IMPORT_ENDPOINT = '/api/get-presign-mirn-url'

export const ImportMirn = () => {
  const { addToast } = useToasts()
  const [loading, setLoading] = useState(false)
  const [deletingFile, setDeletingFile] = useState('')
  const { data, refetch } = useQuery(GET_MIRN)
  const { hasAccess, loading: permissionLoading, error: permissionError } = usePermission()

  const access = useMemo(() => {
    const permissionObj: Partial<Record<AllPermissionsVal, boolean | null>> = {}
    ;(['write', 'delete'] as const).forEach((permission) => {
      permissionObj[permission] = hasAccess({ listKey: 'Mirn', permissionType: permission })
    })
    return permissionObj
  }, [permissionLoading, permissionError])

  const [createMirn] = useMutation(CREATE_MIRN)
  const refetchList = async () => {
    try {
      await refetch()
    } catch (err: any) {
      addToast({
        title: `Error`,
        message: err?.message || 'Some error occurred please refresh the page',
        tone: 'negative',
      })
    }
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const fileName = e?.target?.file?.files?.[0]?.name || ''
    if (!fileName) {
      addToast({
        title: `Warning`,
        message: 'Please select correct data',
        tone: 'warning',
      })
      return
    }

    setLoading(true)
    try {
      const { uploadUrl, isDuplicateFile } = await fetchEpicAPI(IMPORT_ENDPOINT, {
        fileName,
      })
      if (isDuplicateFile) {
        e.target.reset()
        addToast({
          title: `Error`,
          message: 'File with same name already exists',
          tone: 'negative',
        })
        return
      }
      await axios.put(uploadUrl, e.target.file.files[0])

      await createMirn({
        variables: {
          data: {
            fileName,
          },
        },
      })

      addToast({
        title: `Success`,
        message: 'File uploaded Successfully!',
        tone: 'positive',
      })
      e.target.reset()
      await refetchList()
    } catch (err: any) {
      await handleDelete(fileName)
      console.error(err)
      addToast({
        title: `Error`,
        message: err?.message || 'Some error occurred ',
        tone: 'negative',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (element: any) => {
    try {
      const res = await fetchEpicAPI(EXPORT_ENDPOINT, {
        fileName: element.fileName,
      })
      if (res.url) window.open(res.url, '_blank')
      else throw new Error(`Couldn't generate the export url`)

      addToast({
        title: `Success`,
        message: 'Download started Successfully!',
        tone: 'positive',
      })
    } catch (err: any) {
      addToast({
        title: `Error`,
        message: err.message || 'Some error occurred',
        tone: 'negative',
      })
    }
  }

  const handleDelete = async (fileName: string, id?: string) => {
    setDeletingFile(id || '')
    try {
      await fetchEpicAPI(DELETE_ENDPOINT, {
        fileName,
        id,
      })
      if (id) {
        await refetchList()
        addToast({
          title: `Success`,
          message: 'File deleted Successfully!',
          tone: 'positive',
        })
      }
    } catch (err: any) {
      addToast({
        title: `Error`,
        message: err.message || 'Some error occurred',
        tone: 'negative',
      })
    }
    setDeletingFile('')
  }

  return (
    <PermissionWrapper mappedTables={['Mirn']} permissionType="read">
      <Heading type="h3">Import MIRN Data</Heading>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {access.write && (
          <Stack gap="medium" align="start">
            <FieldWrapper>
              <h3>File: </h3>
              <label style={FileUpload}>
                <input type="file" name="file" accept=".csv" />
              </label>
            </FieldWrapper>
            <FieldWrapper>
              <Button disabled={loading} tone="active" weight="bold" type="submit">
                {loading ? <LoadingDots label="Loading current color" size="medium" /> : 'Import'}
              </Button>
            </FieldWrapper>
          </Stack>
        )}

        <div>
          <Table stickyHeader>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>File name</Table.Th>
                <Table.Th>Created at</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.mirns?.map((ele: any) => {
                return (
                  <Table.Tr key={ele.id} style={{ alignItems: 'center' }}>
                    <Table.Td>{ele.fileName}</Table.Td>
                    <Table.Td>{utcToAest(ele.createdAt)}</Table.Td>
                    <Table.Td>{ele.status ? 'Ingested' : 'Not Ingested'}</Table.Td>
                    <Table.Td>
                      <Button type="button" onClick={() => handleExport(ele)}>
                        Export
                      </Button>
                    </Table.Td>
                    {access.delete && (
                      <Table.Td>
                        <Button
                          disabled={deletingFile === ele.id}
                          onClick={() => handleDelete(ele.fileName, ele.id)}
                          type="button"
                        >
                          {deletingFile === ele.id ? (
                            <LoadingDots label="Loading current color" size="medium" />
                          ) : (
                            'Delete'
                          )}
                        </Button>
                      </Table.Td>
                    )}
                  </Table.Tr>
                )
              })}
            </Table.Tbody>
          </Table>
        </div>
      </form>
    </PermissionWrapper>
  )
}
