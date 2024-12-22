import { gql } from '@apollo/client'

export const RETAILER_MATRIX = gql`
  query RETAILER_MATRIX($take: Int, $where: RetailerMatrixWhereInput!) {
    retailerMatrices(take: $take, where: $where) {
      id
      retailer {
        name
      }
      vertical {
        slug
      }
      propertyType
      saleType
      energyType
      state
      cost
      range
      moveIn
      plan {
        name
      }
      startDate
      endDate
      updatedAt
    }
  }
`

export const GET_RETAILER_FIELDS = gql`
  query GET_RETAILER_FIELDS($where: ProviderWhereUniqueInput!) {
    verticals {
      id
      name
      slug
    }
    provider(where: $where) {
      id
      name
      plans {
        id
        name
      }
    }
    mediaFiles {
      id
      name: title
    }
  }
`
