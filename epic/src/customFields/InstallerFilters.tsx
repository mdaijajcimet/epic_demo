import React from 'react'
import { FilteredFieldProps, FilteredRelationshipField } from './Common/FilteredRelationshipField'

export function Field(props: FilteredFieldProps) {
  const { value } = props
  return (
    <FilteredRelationshipField
      {...props}
      emptyDropdown={!value.id}
      extraFilters={value.id ? [{ installer: { id: { in: value.id } } }] : []}
    />
  )
}
