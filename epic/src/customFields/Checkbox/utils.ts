/* eslint-disable @typescript-eslint/no-explicit-any */
import { differenceBy } from 'lodash'

export const hideCheckboxKeys: Record<string, any> = {
  includeAllSubAff: (item: any) => {
    const oldValues = item?.affiliate?.value?.initialValue ?? []
    const newValues = item?.affiliate?.value?.value ?? []
    return !(differenceBy(newValues, oldValues, 'id').length > 0)
  },
}
