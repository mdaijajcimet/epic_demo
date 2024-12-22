import { gql, useQuery } from '@keystone-6/core/admin-ui/apollo'
import React from 'react'
import { FilteredFieldProps, FilteredRelationshipField } from './Common/FilteredRelationshipField'

export function Field(props: FilteredFieldProps) {
  const { data } = useQuery(
    gql`
      query GET_SOLAR_BUNDLES {
        items: solarBundle(where: { id: ${props.value.id} }) {
          installer {
            id
          }
        }
      }
    `,
  )

  const installerId = data?.items?.installer?.id

  return (
    <FilteredRelationshipField
      {...props}
      emptyDropdown={!installerId}
      extraFilters={installerId ? [{ installer: { id: { in: installerId } } }] : []}
    />
  )
}
