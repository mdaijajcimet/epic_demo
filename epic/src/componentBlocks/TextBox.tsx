/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields } from '@keystone-6/fields-document/component-blocks'
import { getColorField } from './utils'

export const TextBox = component({
  preview: (props) => {
    const { content, bgColor } = props.fields

    return (
      <div style={{ backgroundColor: bgColor.value }}>
        <p>{content.element}</p>
      </div>
    )
  },
  label: 'Text Box',
  schema: {
    bgColor: getColorField('Background Color'),
    content: fields.child({
      kind: 'block',
      placeholder: 'Add Content...',
      formatting: 'inherit',
      dividers: 'inherit',
      links: 'inherit',
      relationships: 'inherit',
    }),
  },
})
