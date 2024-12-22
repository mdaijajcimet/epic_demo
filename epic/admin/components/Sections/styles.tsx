import React, { ReactNode } from 'react'
import { useTheme } from '@keystone-ui/core'

export const FieldWrapper = ({
  children,
  style,
  className,
}: {
  children: ReactNode
  style?: Record<string, any>
  className?: string
}) => {
  const { spacing } = useTheme()
  return (
    <div
      style={{
        marginTop: spacing.medium,
        marginBottom: spacing.medium,
        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  )
}

export const FileUpload = {
  border: '1px solid #ccc',
  display: 'inline-block',
  padding: '6px 12px',
  cursor: 'pointer',
  backgroundColor: '#eff3f6',
  color: '#6b7280',
}

export const HR = {
  border: 'none',
  height: '1px',
  backgroundColor: '#ccc',
  margin: '40px 0',
}
