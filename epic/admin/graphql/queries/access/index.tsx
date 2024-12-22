import { gql } from '@keystone-6/core/admin-ui/apollo'

export const GET_SESSION = gql`
  query User($where: UserWhereUniqueInput!) {
    user(where: $where) {
      id
      name
      roles {
        id
        name

        role
        user
        creditCards
        generic
        healthInsurance
        solar
        personalLoan
        broadband
        mobile
        energy
        bundle
        affiliate
        subAffiliate
        csSite
        vertical
        lms
        auditLog
        uiElements
        formElements
        scripts
        commision
        dialerList
        members
        pages
        passwordSetting
        mirn
        state
        tariffCode
        ignoreData
        openEnergyBillRule
      }
    }
  }
`
