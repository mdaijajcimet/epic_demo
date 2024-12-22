import { gql } from '@apollo/client'

export const GET_PROVIDER = gql`
  query GET_PROVIDER($where: ProviderWhereUniqueInput!) {
    provider(where: $where) {
      name
    }
  }
`

export const GET_PROVIDERS = gql`
  query GET_PROVIDERS {
    providers {
      id
      name
      slug
    }
  }
`

export const GET_AUDIT_LOGS = gql`
  query GET_AUDIT_LOGS($where: AuditLogWhereInput, $orderBy: [AuditLogOrderByInput!]) {
    auditLogs(where: $where, orderBy: $orderBy) {
      id
      docId
      username
      attributeName
      actionType
      newValue
      oldValue
      createdAt
    }
  }
`

export const GET_SUBAFFILIATES = gql`
  query Affiliate($where: AffiliateWhereUniqueInput!) {
    affiliate(where: $where) {
      name
      subAffiliates {
        name
        rcCodes
        id
      }
    }
  }
`
