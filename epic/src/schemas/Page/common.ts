import { text } from '@keystone-6/core/fields'

export const coloursSchema = () => ({
  label: 'Colours',
  fields: {
    primaryColor: text({ ui: { itemView: { fieldPosition: 'sidebar' } } }),
    secondaryColor: text({ ui: { itemView: { fieldPosition: 'sidebar' } } }),
    accentColor: text({ ui: { itemView: { fieldPosition: 'sidebar' } } }),
  },
})
