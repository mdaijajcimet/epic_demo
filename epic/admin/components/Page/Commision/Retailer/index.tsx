import React from 'react'
import { Heading } from '@keystone-ui/core'
import { LoadingDots } from '@keystone-ui/loading'
import { useQuery } from '@keystone-6/core/admin-ui/apollo'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'

import Layout from '../../../Layout'
import Table from '../../../Common/Table'
import { GET_PROVIDERS } from '../../../../graphql/queries/Common'
import '../styles.css'

const Retailer = () => {
  const { data, loading, error } = useQuery(GET_PROVIDERS)
  if (loading) return <LoadingDots label={'Loading Retailers'} size="medium" />
  if (error) return null
  const headers = ['id', 'name', 'slug']
  const header = <Heading type="h3">{`Retailer`}</Heading>
  return (
    <MantineProvider>
      <Layout header={header}>
        <div className="matrix-container">
          <Heading textAlign="center" padding="medium" type="h2">{`List of Retailers`}</Heading>
          <Table data={data.providers} headers={headers} />
        </div>
      </Layout>
    </MantineProvider>
  )
}

export default Retailer
