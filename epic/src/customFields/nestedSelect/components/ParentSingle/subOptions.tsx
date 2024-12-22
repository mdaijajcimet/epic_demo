import { find } from 'lodash'
import React, { useEffect } from 'react'
import ReactSelect from 'react-select'

export const SubOptions = ({ subOpts, formState, onChange, hasSubDisabled, isMulti }: any) => {
  const selectedSubOptions = isMulti
    ? formState?.subOptions?.filter((item: any) =>
        find(subOpts, (opt) => opt?.value === item?.value && opt?.label === item?.label),
      )
    : formState?.subOptions

  const subOptsChangeHandler = (subOpt: any) => {
    const common = {
      label: formState?.label ?? '',
    }
    onChange?.(
      JSON.stringify({
        ...common,
        subOptions: subOpt,
      }),
    )
  }

  useEffect(() => {
    if (subOpts?.length && selectedSubOptions?.length !== formState?.subOptions?.length) {
      subOptsChangeHandler(selectedSubOptions)
    }
  }, [subOpts])

  return (
    <ReactSelect
      isMulti={isMulti}
      isClearable
      options={subOpts}
      isSearchable
      isDisabled={!subOpts.length || hasSubDisabled}
      defaultValue={selectedSubOptions}
      value={selectedSubOptions}
      onChange={subOptsChangeHandler}
      maxMenuHeight={100}
    />
  )
}
