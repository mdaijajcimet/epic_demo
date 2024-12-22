import { fields } from '@keystone-6/fields-document/component-blocks'

import { GetListItemTextParams } from './types'

export const pageField = fields.select({
  label: 'Page',
  options: [
    { label: 'Landing Page', value: 'landingPage' },
    { label: 'Careers Page', value: 'careersPage' },
    { label: 'About Page', value: 'aboutPage' },
    { label: 'Blogs Page', value: 'blogsPage' },
    { label: 'Steps Page', value: 'stepsPage' },
  ],
  defaultValue: 'landingPage',
})

export const getColorField = (label: string) => {
  return fields.select({
    label,
    options: [
      { label: 'Default', value: '' },
      { label: 'Gray (#F6F6F6)', value: '#F6F6F6' },
      { label: 'Gray (#F5F5F5)', value: '#F5F5F5' },
      { label: 'Gray (#E0E0E0)', value: '#E0E0E0' },
      { label: 'Gray (#8D8D8D)', value: '#8D8D8D' },
      { label: 'Sky blue (#00A8E821)', value: '#00A8E821' },
      { label: 'Sky blue (#00A8E8)', value: '#00A8E8' },
      { label: 'Dark blue (#003459)', value: '#003459' },
      { label: 'Orange (#FDA212)', value: '#FDA212' },
      { label: 'Black (#3D4046)', value: '#3D4046' },
      { label: 'White (#fff)', value: '#fff' },
    ],
    defaultValue: '',
  })
}

export const getListItemText = ({ item, defaultValue, isModal = false }: GetListItemTextParams) => {
  if (item) {
    const charLength = isModal ? 30 : 60
    let itemText
    if (typeof item === 'string') itemText = item
    else itemText = item?.find((itemValue) => itemValue && typeof itemValue === 'string') || defaultValue
    return itemText?.length > charLength ? `${itemText?.slice(0, charLength)}...` : itemText
  }
  return defaultValue
}

export const idField = fields.text({ defaultValue: 'Do not edit this field', label: 'id' })
