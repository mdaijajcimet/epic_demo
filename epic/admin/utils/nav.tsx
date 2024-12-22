import type { ListMeta } from '@keystone-6/core/types'
import type { CustomNavList } from '../types/nav'

export const findListItem = (array: ListMeta[] | CustomNavList[]) =>
  array.find((item) => item.path === window.location.pathname.split('/').slice(1).join('/'))
