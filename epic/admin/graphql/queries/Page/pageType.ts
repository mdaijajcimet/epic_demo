const query = `
  query PageType($where: PageWhereInput!) {
    pages(where: $where) {
      type
    }
  }
`

const variables = (type = '') => {
  if (!type) return { where: {} }
  return {
    where: {
      type: { equals: type },
    },
  }
}

export default { query, variables, type: 'pages' }
