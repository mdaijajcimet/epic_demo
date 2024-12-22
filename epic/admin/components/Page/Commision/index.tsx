import React from 'react'
import { Heading } from '@keystone-ui/core'
import { Link } from '@keystone-6/core/admin-ui/router'

import Layout from '../../Layout'
import './styles.css'

const Commision = () => {
  const header = <Heading type="h3">Commision</Heading>
  return (
    <Layout header={header}>
      <div className="groups-container">
        <Link className="group-box" href="/commision/retailer">
          <h3>Retailer</h3>
        </Link>
        <Link className="group-box" href="#">
          <h3>Affiliate</h3>
        </Link>
        <Link className="group-box" href="#">
          <h3>Sub-affiliate</h3>
        </Link>
      </div>
    </Layout>
  )
}

export default Commision
