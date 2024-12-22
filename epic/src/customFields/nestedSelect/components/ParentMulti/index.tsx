/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldProps } from '@keystone-6/core/types'
import { FieldContainer, FieldDescription, FieldLabel } from '@keystone-ui/fields'
import React, { useState, useEffect } from 'react'
import ReactSelect from 'react-select'
import isEmpty from 'lodash/isEmpty'
import { controller } from '../../views'
import fetchEpicAPI from '../../../../libs/fetchEpicAPI'
import { useSubOptions } from '../../../../../admin/hooks/useSubOptions'
import { StringOption } from '../../types'
import { SubOptions } from './subOptions'

// Field in Item view
export const ParentMulti = ({
  field,
  value: currentVal,
  onChange,
  autoFocus,
}: FieldProps<typeof controller>) => {
  const [subOpts, setSubOpts] = useState<any[]>([])
  const [dynamicOptions, setDynamicOptions] = useState<any[]>([])
  // Todo : Change this Fetch Call Accordingly For reuse
  const { getAllSubOptions } = useSubOptions()
  const { childName, parentName, linkKey, childLabel } = field

  const formState = currentVal ? JSON.parse(currentVal) : currentVal
  const selectedOptions = formState?.[parentName] || []

  const optionsChangeHandler = async (option: any) => {
    const updatedOption = option.map((item: any) => ({ value: item.value, label: item.label }))
    const subOptions = await getAllSubOptions(updatedOption, parentName)
    const remainingSubOptions = formState?.[childName]?.filter((x: any) =>
      subOptions.some((y: any) => y.value === x.value),
    )
    onChange?.(JSON.stringify({ [childName]: remainingSubOptions, [parentName]: updatedOption }))
    setSubOpts(subOptions)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { options, isDynamic, filterKey } = field || {}
        let updateOptions = [...options]
        if (isDynamic) {
          let query = { table: parentName, where: {} }
          if (filterKey) {
            query = { ...query, where: { key: { contains: filterKey, mode: 'insensitive' } } }
          }
          const { success, data } = await fetchEpicAPI('/api/table-data', query)
          if (success && !isEmpty(data)) {
            const newOptions = data?.map((option: any) => ({
              label: option?.name,
              value: (linkKey && option?.[linkKey]) ?? option?.id,
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
    if (selectedOptions) optionsChangeHandler(selectedOptions)
  }, [])

  const key = field.label + Math.random() * 10
  return (
    <FieldContainer as="div">
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <FieldDescription id={key} key={key}>
        {field?.description}
      </FieldDescription>
      <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Options */}
        <ReactSelect
          isSearchable
          isClearable
          isMulti
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          options={dynamicOptions.map((option: StringOption): any => ({
            label: option?.label,
            value: option?.value,
          }))}
          value={selectedOptions}
          maxMenuHeight={200}
          onChange={(val) => optionsChangeHandler(val)}
          autoFocus={autoFocus}
        />
        {/* Sub-options */}
        <div>
          {childLabel && <FieldLabel>{childLabel}</FieldLabel>}
          <SubOptions {...{ onChange, formState, field, subOpts, hasSubDisabled: field?.hasSubDisabled }} />
        </div>
      </div>
    </FieldContainer>
  )
}
