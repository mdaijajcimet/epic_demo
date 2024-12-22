import React, { useEffect } from 'react'
import { isEmpty } from 'lodash'
import { ScrollArea } from '@mantine/core'
import { Heading } from '@keystone-ui/core'
import { LoadingDots } from '@keystone-ui/loading'

import Table from './Table'
import useAuditLogs from '../../hooks/useAuditLogs'
import './styles.css'

const AuditLog = ({ table, variables }: { table: string; variables?: Record<string, unknown> }) => {
  const { data, loading, error, refetch } = useAuditLogs(table, variables)
  useEffect(() => {
    if (refetch) {
      refetch()
    }
  }, [loading])
  if (loading) return <LoadingDots label={'Loading Logs'} size="medium" />
  if (error) return null
  const headers = ['docId', 'username', 'attributeName', 'actionType', 'oldValue', 'newValue', 'createdAt']
  if (isEmpty(data?.auditLogs)) return null
  return (
    <div className="matrix-container">
      <hr className="hr-line" />
      <Heading textAlign="center" padding="medium" type="h2">{`${table} Audit Logs`}</Heading>
      <ScrollArea type="never">
        <Table data={data?.auditLogs} headers={headers} />
      </ScrollArea>
    </div>
  )
}

export default AuditLog
