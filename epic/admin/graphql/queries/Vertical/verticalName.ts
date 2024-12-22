const query = `
  query VerticalName($where: VerticalWhereInput!) {
    verticals(where: $where) {
      id
      name
    }
  }
`

const variables = (name = '') => {
  if (!name) return { where: {} }
  return {
    where: {
      name: { equals: name },
    },
  }
}

export default { query, variables, type: 'verticals' }
