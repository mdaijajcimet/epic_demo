/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Heading } from '@keystone-ui/core'

import Modal from '../Common/Modal'
import './styles.css'

export const CommisionHeader = ({ providerName, hasCreate, children }: Record<string, any>) => {
  return (
    <div className="header-section">
      <Heading type="h2">{providerName}</Heading>
      {hasCreate ? (
        <Modal className="header-button" title="Create" buttonText="Create">
          {children}
        </Modal>
      ) : null}
    </div>
  )
}

export const generateRetailerFilters = (id: string, docIds: string[]) => {
  return {
    filters: {
      OR: [
        {
          newValue: {
            contains: id,
            mode: 'insensitive',
          },
        },
        {
          oldValue: {
            contains: id,
            mode: 'insensitive',
          },
        },
        {
          docId: { in: docIds },
        },
      ],
    },
  }
}
