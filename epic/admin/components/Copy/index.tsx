import { useKeystone } from '@keystone-6/core/admin-ui/context'
import type { ListMeta } from '@keystone-6/core/types'
import { Heading, Stack } from '@keystone-ui/core'
import { Select } from '@keystone-ui/fields'
import React, { useEffect, useState } from 'react'

import { Table } from '../../components/Copy/Table'
import { PermissionWrapper } from '../../components/Sections/common/PermissionWrapper'
import { FieldWrapper, HR } from '../../components/Sections/styles'
import type { CommonActionProps } from '../../types/tableActions'
import { copyAllowedTablesMap } from './config'
import styles from './style.module.css'

type Option = {
  label: string
  value: string
  isDisabled?: boolean
}

const Copy = ({ actionTables, shouldRedirect = false }: CommonActionProps) => {
  const { adminMeta } = useKeystone()
  const { lists } = adminMeta
  const [tables, setTables] = useState<Option[] | null>([])
  const [selectedTable, setSelectedTable] = useState<Option | null>(null)
  const tableChangeHandler = async (option: Option) => {
    setSelectedTable(option)
  }

  useEffect(() => {
    if (tables?.length) tableChangeHandler(tables[0])
  }, [])

  return (
    <PermissionWrapper
      {...{
        options: { setSelectedTable, setTables, shouldRedirect },
        mappedTables: copyAllowedTablesMap,
        actionTables,
      }}
    >
      {tables ? (
        <>
          <Heading type="h3">Copy</Heading>
          <Stack gap="medium" align="start">
            <FieldWrapper className={styles.selectWrapper}>
              <h3>Select Table:</h3>
              <Select
                id="table"
                name="table"
                value={selectedTable || null}
                width="large"
                options={tables}
                onChange={tableChangeHandler}
              />
            </FieldWrapper>
          </Stack>
          {!!selectedTable && (
            <Table list={lists[selectedTable.value] as ListMeta & { listQueryName: string }} />
          )}
          <hr style={HR} />
        </>
      ) : null}
    </PermissionWrapper>
  )
}

export default Copy
