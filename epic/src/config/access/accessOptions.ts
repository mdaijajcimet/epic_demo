import { ACCESS_MODULE_MAP } from './accessModules'

export const BASIC_PERMISSION_OPTIONS_MAP = {
  read: { label: 'Read', value: 'read' },
  write: { label: 'Write', value: 'write' },
  delete: { label: 'Delete', value: 'delete' },
} as const

export const PUBLISH_OPTION = {
  publish: { label: 'Publish', value: 'publish' },
} as const

export const MODULE_PERMISSION_OPTIONS_MAP = {
  [ACCESS_MODULE_MAP.other.modules.pages]: { ...PUBLISH_OPTION },
  [ACCESS_MODULE_MAP.other.modules.openEnergyBillRule]: { ...PUBLISH_OPTION },
} as const
