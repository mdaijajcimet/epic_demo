/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields } from '@keystone-6/fields-document/component-blocks'

import { getListItemText, idField } from './utils'

export const Plans = component({
  preview: () => {
    return <div></div>
  },
  label: 'Plans',
  schema: {
    vertical: fields.relationship({
      label: 'Vertical',
      listKey: 'Vertical',
      selection: 'slug',
    }),
    title: fields.text({ label: 'Title' }),
    description: fields.text({ label: 'Description' }),
    categories: fields.array(
      fields.object({
        id: idField,
        categoryName: fields.text({ label: 'Category Name' }),
        cta: fields.object({
          categoryImage: fields.relationship({
            label: 'Category Image',
            listKey: 'Media',
            selection: 'title file {url} altText',
          }),
          ctaTitle: fields.text({ label: 'CTA Title' }),
          ctaDescription: fields.text({ label: 'CTA Description' }),
          ctaLink: fields.url({ label: 'CTA Link' }),
          ctaLabel: fields.text({ label: 'CTA Label' }),
        }),
        cards: fields.array(
          fields.object({
            creditCard: fields.relationship({
              label: 'Credit Card',
              listKey: 'CreditCard',
              selection: 'uuid name description image {file {url} altText}',
            }),
            ctaLink: fields.url({ label: 'CTA Link' }),
            ctaLabel: fields.text({ label: 'CTA Label' }),
          }),
          {
            label: 'Add cards',
            itemLabel: (props) =>
              getListItemText({
                item: props?.fields?.creditCard?.value?.label?.slice(0, 31),
                defaultValue: 'Card',
              }),
          },
        ),
      }),
      {
        label: 'Add categories',
        itemLabel: (props) =>
          getListItemText({
            item: props?.fields?.categoryName?.value,
            defaultValue: 'Category',
          }),
      },
    ),
  },
})
