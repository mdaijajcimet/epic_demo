const query = `
  query PageDomain($where: PageWhereInput!) {
    pages(where: $where) {
      domain {
        name
      }
    }
  }
`

const variables = (domain = '') => {
  if (!domain) return { where: {} }
  return {
    where: {
      domain: {
        name: { equals: domain },
      },
    },
  }
}

export default { query, variables, type: 'pages' }
