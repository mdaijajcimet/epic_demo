/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmpty, difference, get, isNaN } from 'lodash'
import React, { useState, useRef, useEffect } from 'react'
import { useToasts } from '@keystone-ui/toast'
import { LoadingDots } from '@keystone-ui/loading'
import { useRouter } from '@keystone-6/core/admin-ui/router'
import { Button } from '@keystone-ui/button'
import { Select, TextInput, DatePicker, FieldLabel, FieldContainer, MultiSelect } from '@keystone-ui/fields'

import useRetailerFields from '../../hooks/useRetailerFields'
import { flattenedFields } from '../../utils/financialMatrix'
import {
  propertyType,
  saleType,
  energyType,
  moveIn,
  commisionFilterType,
  states,
} from '../../../src/constants/selectOptions'
import { FieldWrapper } from '../Sections/styles'

const CreateRetailer = ({ setTableData }: any) => {
  const router = useRouter()
  const { addToast } = useToasts()
  const { id } = router.query
  const [formData, setFormData] = useState<any>({
    vertical: null,
    range: null,
    plan: null,
    state: null,
    moveIn: null,
    energyType: null,
    propertyType: null,
    saleType: null,
    startDate: null,
    endDate: null,
    filterType: null,
    cost: null,
    image: null,
  })
  const rangeInputRef = useRef<HTMLInputElement | null>(null)
  const costInputRef = useRef<HTMLInputElement | null>(null)
  const [activeInput, setActiveInput] = useState<string | null>(null)

  useEffect(() => {
    if (activeInput) {
      if (activeInput === 'range' && rangeInputRef.current) {
        rangeInputRef.current.focus()
      } else if (activeInput === 'cost' && costInputRef.current) {
        costInputRef.current.focus()
      }
    }
  }, [activeInput, formData])

  const { loading, error, ...rest } = useRetailerFields(id as string)
  if (loading) return <LoadingDots label={'Loading Retailers'} size="medium" />
  if (error) return null

  const { providerId, verticals, images, plans, createRetailerMatrix } = rest

  const handleInputChange = (item: any, key: string) => {
    if (!key) return
    const resetVerticalFields = {
      propertyType: null,
      saleType: null,
      energyType: null,
    }
    if (key === 'vertical') {
      setFormData((prev: Record<string, any>) => ({
        ...prev,
        [key]: item,
        ...resetVerticalFields,
      }))
    } else if (key === 'filterType') {
      const filterTypes = item?.map(({ value }: { value: string }) => value)
      const updatedTypes = {} as any
      difference(['range', 'moveIn', 'plan'], filterTypes)?.forEach((val: string) => {
        updatedTypes[val] = null
      })
      setFormData((prev: Record<string, any>) => ({
        ...prev,
        [key]: item,
        ...updatedTypes,
      }))
    } else {
      setFormData((prev: Record<string, any>) => ({
        ...prev,
        [key]: item,
      }))
    }
    setActiveInput(null)
  }

  const handleTextInputChange = (event: any) => {
    const { name, value } = event.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
    setActiveInput(name)
  }
  const handleResetDate = async (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: null,
    }))
    setActiveInput(null)
  }

  const FieldLayout = ({ labelKey, label, children }: any) => {
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
          value={formData[key]}
          onChange={(item: Record<string, any>) => handleInputChange(item, key)}
          options={options}
        />
      </FieldLayout>
    )
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    try {
      const updatedData = flattenedFields(formData)
      if (
        !updatedData?.cost ||
        isNaN(updatedData?.cost) ||
        Number(updatedData?.cost) <= 0 ||
        !updatedData?.startDate
      ) {
        addToast({
          title: `Error`,
          message: 'Cost & StartDate are required!',
          tone: 'warning',
        })
        return
      }
      const variables = { retailer: { connect: { id: providerId } }, ...updatedData }
      const res = await createRetailerMatrix(variables)
      const matrixData = get(res, 'data.createRetailerMatrix', null)
      if (matrixData?.id) {
        addToast({
          title: `Success`,
          message: 'Retailer Matrix Created Successfully!',
          tone: 'positive',
        })
        setFormData((prev: Record<string, any>) => ({
          ...prev,
          range: null,
          plan: null,
          moveIn: null,
          cost: null,
          image: null,
        }))
        setActiveInput(null)
        setTableData((prev: Record<string, any>[]) => [...prev, matrixData])
        return
      }
      addToast({
        title: `Error`,
        message: 'Some Error occured!',
        tone: 'warning',
      })
      return
    } catch (error: any) {
      console.error('Error submitting form:', error)
      addToast({
        title: `Error`,
        message: error,
        tone: 'negative',
      })
    }
  }

  const filterTypes = formData?.filterType?.map(({ value }: Record<string, any>) => value)

  return (
    <FieldWrapper>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {selectGroup('vertical', 'Vertical', verticals)}
        {formData?.vertical && ['energy', 'mobile'].includes(formData?.vertical?.value) && (
          <FieldContainer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {selectGroup('propertyType', 'Property Type', propertyType)}
            {selectGroup('saleType', 'Sale Type', saleType)}
            {formData?.vertical?.value === 'energy' && selectGroup('energyType', 'Energy Type', energyType)}
          </FieldContainer>
        )}
        {selectGroup('state', 'State', states)}
        {selectGroup('filterType', 'Filter Type', commisionFilterType, MultiSelect)}
        {!isEmpty(filterTypes) && (
          <>
            {filterTypes.includes('range') && (
              <FieldLayout labelKey="range" label="Range">
                <TextInput
                  type="text"
                  id="range"
                  name="range"
                  ref={rangeInputRef}
                  onChange={handleTextInputChange}
                  defaultValue={formData?.range}
                />
              </FieldLayout>
            )}
            {filterTypes.includes('moveIn') && selectGroup('moveIn', 'Move In', moveIn)}
            {filterTypes.includes('plan') && selectGroup('plan', 'Plan', plans)}
          </>
        )}
        <FieldLayout labelKey="cost" label={'Commision Cost($) *'}>
          <TextInput
            type="text"
            id="cost"
            name="cost"
            ref={costInputRef}
            onChange={handleTextInputChange}
            defaultValue={formData?.cost}
          />
        </FieldLayout>
        {selectGroup('image', 'Image', images)}
        <FieldContainer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <FieldLayout labelKey="startDate" label={'Start Date *'}>
            <DatePicker
              key="startDate"
              value={formData?.startDate}
              onUpdate={(item) => handleInputChange(item, 'startDate')}
              onClear={() => handleResetDate('startDate')}
            />
          </FieldLayout>
          <FieldLayout labelKey="endDate" label={'End Date'}>
            <DatePicker
              key="endDate"
              value={formData?.endDate}
              onUpdate={(item) => handleInputChange(item, 'endDate')}
              onClear={() => handleResetDate('endDate')}
            />
          </FieldLayout>
        </FieldContainer>
        <FieldContainer style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
          <Button tone="active" weight="bold" type="submit">
            Submit
          </Button>
        </FieldContainer>
      </form>
    </FieldWrapper>
  )
}

export default CreateRetailer
