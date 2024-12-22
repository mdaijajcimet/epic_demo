const query = `
  query Domains($where: DomainWhereInput!) {
    domains(where: $where) {
      name
    }
  }
`

const variables = (domain = '') => {
  if (!domain) return { where: {} }
  return {
    where: {
      name: { equals: domain },
    },
  }
}

export default { query, variables, type: 'domains' }
