import { accessModules } from '../../src/constants/access'
import { VERTICAL_KEYS } from '../../src/constants/verticals'
import type { VerticalModule, AccessModules } from '../../src/types/access'

/**
 * @type {AccessModules[]}
 */
export const INDIVIDUAL_ACTION_MODULES = [
  ...(VERTICAL_KEYS as VerticalModule[]),
  'lms',
  'pages',
  'mirn',
  'tariffCode',
  'openEnergyBillRule',
] as const

export const SKIP_ACTION_MODULES = ['user', 'role', 'auditLog'] as AccessModules[]

export const COMMON_ACTION_MODULES = accessModules.filter(
  (module) => !([...INDIVIDUAL_ACTION_MODULES, ...SKIP_ACTION_MODULES] as AccessModules[]).includes(module),
)
