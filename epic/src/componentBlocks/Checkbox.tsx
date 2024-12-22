/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields } from '@keystone-6/fields-document/component-blocks'
import { nanoid } from 'nanoid'

import { useEffect } from 'react'

export const Checkbox = component({
  preview: function CheckboxList(props) {
    useEffect(() => {
      if (!props.fields.children.elements.length) {
        props.fields.children.onChange([{ key: undefined }])
      }
    })
    return (
      <ul css={{ padding: 0 }}>
        {props.fields.children.elements.map((element) => {
          // gets invoked everytime user creates new checkbox
          element.fields.uniqueId.schema.defaultValue = nanoid()
          return (
            <li css={{ listStyle: 'none' }} key={element.key}>
              <input
                contentEditable="false"
                css={{ marginRight: 8 }}
                type="checkbox"
                checked={element.fields.done.value}
                onChange={(event) => element.fields.done.onChange(event.target.checked)}
              />
              <span
                style={{
                  textDecoration: element.fields.done.value ? 'line-through' : undefined,
                }}
              >
                {element.fields.content.element}
              </span>
            </li>
          )
        })}
      </ul>
    )
  },
  label: 'Checkbox',
  schema: {
    children: fields.array(
      fields.object({
        done: fields.checkbox({ label: 'Done' }),
        content: fields.child({ kind: 'inline', placeholder: '', formatting: 'inherit' }),
        // to make sure checkbox doesn't take null or last value
        uniqueId: fields.text({ label: 'Unique ID', defaultValue: nanoid() }),
      }),
    ),
  },
  chromeless: true,
})
