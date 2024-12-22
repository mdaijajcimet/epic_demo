import { RelationshipFieldConfig } from '@keystone-6/core/fields'
import { BaseListTypeInfo } from '@keystone-6/core/types'

type RelationshipUI = Pick<RelationshipFieldConfig<BaseListTypeInfo>, 'ui'>['ui']

export type CardsUI = { displayMode: 'cards'; cardFields: string[] } & Partial<
  Extract<RelationshipUI, { displayMode: 'cards' }>
>
