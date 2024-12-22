import { gql } from '@keystone-6/core/admin-ui/apollo'

export const GET_MIRN = gql`
  query Query {
    mirns(orderBy: { createdAt: desc }) {
      fileName
      createdAt
      status
      id
    }
  }
`
export const CREATE_MIRN = gql`
  mutation CreateMirn($data: MirnCreateInput!) {
    createMirn(data: $data) {
      fileName
      id
      status
    }
  }
`
