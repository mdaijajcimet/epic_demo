import { VerticalSlug } from '../constants/verticals'

export type VerticalSlug = (typeof VerticalSlug)[keyof typeof VerticalSlug]

export type LmsVerticalKeys = 'energy' | 'broadband' | 'mobile' | 'bundle'

export type FalconVerticalKeys = keyof Omit<typeof VerticalSlug, LmsVerticalKeys>

export type VerticalConfig = {
  name: string
  slug: VerticalSlug
}
