import { ACCESS_MODULE_MAP } from './accessModules'

export const LMS_VERTICAL_ACCESS = {
  [ACCESS_MODULE_MAP.verticals.modules.energy]: ['energy', 'electricity', 'gas'],
  [ACCESS_MODULE_MAP.verticals.modules.broadband]: ['broadband', 'internet', 'nbn'],
  [ACCESS_MODULE_MAP.verticals.modules.mobile]: ['mobile', 'mobile-networks'],
  bundle: ['bundle'],
} as const
