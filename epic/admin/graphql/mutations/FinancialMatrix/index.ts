import { gql } from '@apollo/client'

export const CREATE_RETAILER_MATRIX = gql`
  mutation CreateRetailerMatrix($data: RetailerMatrixCreateInput!) {
    createRetailerMatrix(data: $data) {
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
      image {
        file {
          url
        }
      }
      startDate
      endDate
      updatedAt
    }
  }
`

export const DELETE_RETAILER_MATRIX = gql`
  mutation DELETE_RETAILER_MATRIX($where: RetailerMatrixWhereUniqueInput!) {
    deleteRetailerMatrix(where: $where) {
      id
    }
  }
`
