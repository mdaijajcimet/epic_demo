/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'
import { useState } from 'react'
import { TextArea, TextInput } from '@keystone-ui/fields'
import classes from './styles/accordian.module.css'

export const Accordian = component({
  preview: (props) => {
    const [expanded, setExpanded] = useState(true)
    const { title, description } = props.fields

    return (
      <NotEditable>
        <div className={classes.container}>
          <div className={classes.heading}>Accordian</div>
          <div className={classes.header}>
            <TextInput
              className={classes.input}
              onChange={(e) => title.onChange(e.target.value)}
              placeholder={'Title'}
              value={title.value}
            />
            <div onClick={() => setExpanded((prev) => !prev)} className={classes.icon}>
              {expanded ? <MinusIcon /> : <PlusIcon />}
            </div>
          </div>
          {expanded && (
            <div className={classes.content}>
              <TextArea
                className={classes.input}
                onChange={(e) => description.onChange(e.target.value)}
                placeholder={'Description'}
                value={description.value}
              />
            </div>
          )}
        </div>
      </NotEditable>
    )
  },
  label: 'Accordian',
  schema: {
    title: fields.text({ label: 'Title' }),
    description: fields.text({ label: 'Description' }),
  },
  chromeless: true,
})

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px" fillRule="evenodd">
    <path
      fillRule="evenodd"
      d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
    />
  </svg>
)

const MinusIcon = () => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12H20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
