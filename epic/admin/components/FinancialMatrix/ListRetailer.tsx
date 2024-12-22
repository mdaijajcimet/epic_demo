/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { capitalize, upperCase, get, has } from 'lodash'
import { Heading } from '@keystone-ui/core'
import { Collapse, ScrollArea } from '@mantine/core'

import Table from '../Common/Table'
import './styles.css'

const ListRetailer = ({
  groups,
  filters,
  headers,
  deleteRetailerMatrix,
  tableData,
  setTableData,
}: Record<string, any>) => {
  const [toggle, setToggle] = useState<Record<string, boolean>>({})
  const handleRowDelete = async (id: string) => {
    await deleteRetailerMatrix({ id })
    const updatedData = tableData?.filter((item: Record<string, unknown>) => item?.id !== id)
    setTableData(updatedData)
  }

  const handleToggle = (key: string) => {
    setToggle((prev: Record<string, boolean>) => ({
      ...prev,
      [key]: has(prev, key) ? !prev?.[key] : false,
    }))
  }

  return (
    <div className="matrix-container">
      {groups?.map((group: string) => {
        const subGroups = Object.keys(filters[group])
        return (
          <div className="matrix-group" key={group}>
            <Heading
              type="h2"
              onClick={() => handleToggle(group)}
              textAlign={'center'}
              background={'neutral400'}
            >
              {upperCase(group)}
            </Heading>
            <Collapse in={get(toggle, group, true)}>
              {subGroups?.map((subGroup: string) => {
                const key = group + '_' + subGroup
                return (
                  <div className="matrix-subgroup" key={key}>
                    <Heading
                      type="h4"
                      onClick={() => handleToggle(key)}
                      textAlign={'center'}
                      background={'neutral200'}
                    >
                      {capitalize(subGroup)}
                    </Heading>
                    <Collapse in={get(toggle, key, true)}>
                      <ScrollArea type="never">
                        <Table
                          key={key}
                          data={filters[group][subGroup]}
                          headers={headers}
                          pathLink={'/retailer-matrices'}
                          hasDelete
                          handleRowDelete={handleRowDelete}
                        />
                      </ScrollArea>
                    </Collapse>
                  </div>
                )
              })}
            </Collapse>
          </div>
        )
      })}
    </div>
  )
}

export default ListRetailer
