/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import ReactSelect from 'react-select'

export const SubOptions = ({ subOpts, formState, field, onChange }: any) => {
  const { childName } = field
  const selectedSubOptions = formState?.[childName] || []
  const subOptsChangeHandler = (selectedOptions: any) => {
    onChange?.(JSON.stringify({ ...formState, [childName]: selectedOptions }))
    return
  }

  useEffect(() => {
    if (formState && formState?.[childName]) {
      subOptsChangeHandler(formState?.[childName])
    }
  }, [subOpts])

  return (
    <ReactSelect
      isMulti
      isClearable
      isSearchable
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
      }}
      options={subOpts}
      value={selectedSubOptions}
      onChange={subOptsChangeHandler}
      maxMenuHeight={200}
    />
  )
}
