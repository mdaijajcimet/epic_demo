import keys from 'lodash/keys'

import { LMS_VERTICAL_ACCESS } from '../../config/access'
import { VerticalSlug, falconVerticalsConfig, lmsVerticalsConfig } from '../../constants/verticals'
import { DEFAULT_VERTICAL } from '../../schemas/Page/constants'
import type { AccessArgs } from '../../types/access'
import type { FalconVerticalKeys, LmsVerticalKeys } from '../../types/verticals'
import { filterByPermission } from './methods'

export const getAllowedVerticals = (args: AccessArgs) => {
  const falconVerticals = keys(falconVerticalsConfig) as FalconVerticalKeys[]
  const falconPermission = filterByPermission(args, falconVerticals, 'read').map(
    (vertical) => VerticalSlug[vertical as FalconVerticalKeys],
  )
  const lmsVerticals = keys(lmsVerticalsConfig) as LmsVerticalKeys[]
  const lmsPermission = filterByPermission(args, lmsVerticals, 'read').map(
    (vertical) => VerticalSlug[vertical as LmsVerticalKeys],
  )
  return [
    ...falconPermission,
    ...lmsPermission.map((vertical) => LMS_VERTICAL_ACCESS[vertical as LmsVerticalKeys]).flat(1),
    DEFAULT_VERTICAL,
  ]
}
