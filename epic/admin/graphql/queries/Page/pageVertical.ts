const query = `
  query PageVertical($where: PageWhereInput!) {
    pages(where: $where) {
      vertical {
        name
      }
    }
  }
`

const variables = (vertical = '') => {
  if (!vertical) return { where: {} }
  return {
    where: {
      vertical: {
        name: { equals: vertical },
      },
    },
  }
}

export default { query, variables, type: 'pages' }
