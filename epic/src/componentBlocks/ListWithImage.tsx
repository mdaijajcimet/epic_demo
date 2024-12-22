/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'

export const ListWithImage = component({
  preview: (props) => {
    return (
      <div>
        <NotEditable>
          <ul style={{ listStyleType: 'none' }}>
            <li>Title - {props.fields.title.value}</li>
            <li>Description - {props.fields.description.value}</li>
          </ul>
        </NotEditable>
      </div>
    )
  },
  label: 'List with image',
  schema: {
    title: fields.text({ label: 'Title' }),
    description: fields.text({ label: 'Description' }),
    image: fields.relationship({
      label: 'Avatar/Logo/Icon',
      listKey: 'Media',
      selection: 'title file {url} altText',
    }),
    list: fields.array(
      fields.object({
        title: fields.text({ label: 'Title' }),
        description: fields.text({ label: 'Description' }),
      }),
    ),
  },
})
