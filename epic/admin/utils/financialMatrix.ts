/* eslint-disable @typescript-eslint/no-explicit-any */
import { omit, compact, isEmpty, difference, every, isEqual, isNil, isPlainObject, pickBy } from 'lodash'

export const flatRetailerData = (data: any) => {
  return data?.map((item: any) => {
    return {
      ...item,
      range: item?.range?.trim?.(),
      retailer: item?.retailer?.name,
      vertical: item?.vertical?.slug,
      plan: item?.plan?.name,
    }
  })
}

export const updateFilters = (
  key: string,
  subKey: string,
  item: Record<string, string>,
  filters: Record<string, any>,
) => {
  if (!subKey) return false
  if (subKey in filters[key]) {
    filters[key][subKey] = [...filters[key][subKey], item]
  } else {
    filters[key][subKey] = [item]
  }
  return true
}

export const structureMatrixData = (data = [] as any) => {
  const filters = { range: {}, moveIn: {}, plan: {}, state: {}, others: {} } as any
  const groups = Object.keys(filters)
  let vertical = '' as string
  data?.forEach((item: any) => {
    const updatedItem = omit(item, ['updatedAt', '__typename'])
    if (!vertical) vertical = item?.vertical
    const arr = [] as boolean[]
    groups?.forEach((group) => {
      arr.push(updateFilters(group, item[group], updatedItem, filters))
    })
    if (every(arr, (element) => isEqual(element, false))) {
      filters['others']['unmapped'] = filters['others']?.['unmapped']
        ? [...filters['others']['unmapped'], updatedItem]
        : [updatedItem]
    }
  })
  const updatedGroups = compact(
    Object.entries(filters)?.map(([k, v]: any) => {
      if (!isEmpty(v)) {
        return k
      }
      return null
    }),
  )
  return {
    groups: updatedGroups,
    filters,
    vertical,
  }
}

export const getRetailerHeaders = (vertical: string, groups: string[]) => {
  const headers = ['id', 'retailer', 'vertical', 'propertyType', 'saleType', 'energyType', ...groups, 'cost']
  switch (vertical) {
    case 'energy':
      return headers
    case 'mobile':
      return difference(headers, ['energyType'])
    case 'broadband':
      return difference(headers, ['energyType', 'propertyType', 'saleType'])
    default:
      return headers
  }
}

export const removeNullFields = (obj: any) =>
  pickBy(obj, (value, key) => !isNil(value) && value?.trim?.() !== '' && key !== 'filterType')

export const flattenedFields = (obj: Record<string, any>) => {
  const updatedObj = removeNullFields(obj)
  const flattenedObj = {} as any
  Object.entries(updatedObj)?.forEach(([key, value]) => {
    if (isPlainObject(value)) {
      if (['vertical', 'plan', 'image'].includes(key)) {
        flattenedObj[key] = { connect: { id: value?.id } }
      } else {
        flattenedObj[key] = value?.value
      }
    } else if (['startDate', 'endDate'].includes(key)) {
      flattenedObj[key] = new Date(value).toISOString()
    } else {
      flattenedObj[key] = value
    }
  })
  return flattenedObj
}

export const processFilterData = (filters: any) => {
  const updatedFilters = removeNullFields(filters)
  const filterObj = {} as any
  if (!isEmpty(updatedFilters)) {
    Object.entries(updatedFilters)?.forEach(([k, v]) => {
      if (k === 'vertical') {
        filterObj[k] = { slug: { equals: v.value } }
      } else {
        filterObj[k] = { in: [v.value] }
      }
    })
  }
  return filterObj
}
