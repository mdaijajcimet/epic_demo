import type { ReactNode } from 'react'
import type { ListKey } from '../../src/types'
import { INDIVIDUAL_ACTION_MODULES } from '../constants/tableActions'

export type ActionGroupKey = 'default' | (typeof INDIVIDUAL_ACTION_MODULES)[number]

export type CommonActionProps = {
  actionTables: ListKey[]
  shouldRedirect?: boolean
}

export type ActionOption = {
  label: string
  Component: (props: CommonActionProps) => ReactNode
}
export type ActionOptions = Record<string, ActionOption>
