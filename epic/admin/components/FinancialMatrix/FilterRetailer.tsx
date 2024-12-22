/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Button } from '@keystone-ui/button'
import { FieldContainer, FieldLabel, Select } from '@keystone-ui/fields'

import {
  propertyType,
  saleType,
  energyType,
  states,
  financeVerticals,
} from '../../../src/constants/selectOptions'
import { FieldWrapper } from '../Sections/styles'

const FilterRetailer = ({ filterData, setFilterData }: Record<string, any>) => {
  const [filters, setFilters] = useState<any>(filterData)

  const handleInputChange = (item: Record<string, any>, key: string) => {
    setFilters((prev: Record<string, any>) => ({
      ...prev,
      [key]: item,
    }))
  }

  const FieldLayout = ({ labelKey, label, children }: Record<string, any>) => {
    return (
      <FieldContainer style={{ flex: 1, marginLeft: '10px' }}>
        <FieldLabel style={{ marginTop: '10px' }} htmlFor={labelKey}>
          {label}
        </FieldLabel>
        {children}
      </FieldContainer>
    )
  }

  const selectGroup = (key: string, label: string, options: any, Component = Select as any) => {
    return (
      <FieldLayout labelKey={key} label={label}>
        <Component
          isClearable
          id={key}
          name={key}
          value={filters?.[key]}
          onChange={(item: Record<string, any>) => handleInputChange(item, key)}
          options={options}
        />
      </FieldLayout>
    )
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setFilterData(filters)
  }

  const handleReset = async () => {
    setFilters({})
    setFilterData({})
  }

  return (
    <FieldWrapper>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <FieldContainer style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {selectGroup('vertical', 'Vertical', financeVerticals)}
          {selectGroup('propertyType', 'Property Type', propertyType)}
          {selectGroup('saleType', 'Sale Type', saleType)}
          {selectGroup('energyType', 'Energy Type', energyType)}
          {selectGroup('state', 'State', states)}
          <Button style={{ marginLeft: '10px' }} tone="active" weight="bold" type="submit">
            Apply
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            tone="passive"
            weight="bold"
            type="reset"
            onClick={handleReset}
          >
            Reset
          </Button>
        </FieldContainer>
      </form>
    </FieldWrapper>
  )
}

export default FilterRetailer
