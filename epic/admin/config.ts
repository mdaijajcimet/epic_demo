import type { AdminConfig } from '@keystone-6/core/types'
import { CustomNavigation } from './components/CustomNavigation'
import { Logo } from './components/Logo'

export const components: AdminConfig['components'] = {
  Navigation: CustomNavigation,
  Logo: Logo,
}
