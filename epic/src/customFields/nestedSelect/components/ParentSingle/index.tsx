/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldDescription, FieldLabel } from '@keystone-ui/fields'
import React, { useState, useEffect } from 'react'
import ReactSelect from 'react-select'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import { MainOptionsValue, NestedOptionsValue } from '../../types'
import fetchEpicAPI from '../../../../libs/fetchEpicAPI'
import { controller } from '../../views'
import { SubOptions } from './subOptions'

// Field in Item view
export const ParentSingle = ({
  field,
  value: currentVal,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const [subOpts, setSubOpts] = useState<any[]>([])
  const [dynamicOptions, setDynamicOptions] = useState<any[]>([])
  const isChildMulti = field.childType === 'multi'
  const optionsChangeHandler = (option: any) => {
    const label = option?.label ?? ''
    const subOptions = option?.label ? option?.value ?? [] : []
    onChange?.(label ? JSON.stringify({ label, subOptions: isChildMulti ? subOptions : null }) : null)
    setSubOpts(subOptions)
  }
  const formState = currentVal ? JSON.parse(currentVal) : currentVal
  const selectedOption = find(dynamicOptions ?? [], (item) => item.label === formState?.label)
  const defaultIndex = field?.defaultIndex ?? (field.disableDefaultSelection ? null : 0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { options, isDynamic, filterKey } = field || {}
        let updateOptions = [...options]
        if (isDynamic) {
          let query = { table: 'formOption', where: {} }
          if (filterKey) {
            query = { ...query, where: { key: { contains: filterKey, mode: 'insensitive' } } }
          }
          const { success, data } = await fetchEpicAPI('/api/table-data', query)
          if (success && !isEmpty(data)) {
            const newOptions = data?.map((option: any) => ({
              label: option?.label,
              subOptions: option?.options,
            }))
            updateOptions = [...updateOptions, ...newOptions]
          }
        }
        setDynamicOptions(updateOptions)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (currentVal) {
      if (selectedOption) {
        setSubOpts(selectedOption?.subOptions)
      } else if (formState?.label && !selectedOption && dynamicOptions.length) {
        optionsChangeHandler({})
      }
    } else if (defaultIndex !== null && defaultIndex !== undefined)
      optionsChangeHandler({
        label: dynamicOptions?.[defaultIndex]?.label,
        value: dynamicOptions?.[defaultIndex]?.subOptions,
      })
  }, [dynamicOptions])

  const key = field.label + Math.random() * 10
  return (
    <FieldContainer as="div">
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <FieldDescription id={key} key={key}>
        {field?.description}
      </FieldDescription>
      <div style={{ minHeight: '100px' }}>
        {/* Options */}
        <ReactSelect
          isSearchable
          isClearable
          options={dynamicOptions.map(
            (option: NestedOptionsValue): MainOptionsValue => ({
              label: option?.label,
              value: option.subOptions,
            }),
          )}
          maxMenuHeight={100}
          value={selectedOption ? { label: formState?.label, value: formState?.subOptions } : {}}
          onChange={optionsChangeHandler}
          autoFocus={autoFocus}
        />
        {/* Sub-options */}
        <SubOptions
          {...{
            onChange,
            formState,
            subOpts,
            hasSubDisabled: field?.hasSubDisabled,
            isMulti: isChildMulti,
          }}
        />
      </div>
    </FieldContainer>
  )
}
