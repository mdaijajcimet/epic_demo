export const publishOEBillRulesQuery = `
    mutation Mutation($input: SyncBillRulesInput!) {
        syncBillRules(input: $input) {
            status
        }
    }
`
