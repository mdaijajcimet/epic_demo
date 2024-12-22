/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'
import { startCase } from 'lodash'
import { Select } from '@keystone-ui/fields'

const styles = {
  wrapper: {
    display: 'grid',
    gap: '1rem',
    border: '1px solid #e1e5e9',
    padding: '1rem',
    borderRadius: '10px',
  },
  container: {
    display: 'flex',
    padding: '0 1rem',
    gap: '1rem',
  },
  dotContainer: {
    paddingTop: '1rem',
  },
  dot: {
    width: '21px',
    height: '21px',
    borderRadius: '50%',
  },
}

const messageTypes = ['mandatoryVerbatim', 'mandatoryNonVerbatim', 'instructional', 'recommended'] as const

type MessageType = typeof messageTypes[number]

type ColorByMessageType = {
  [key in MessageType as string]: {
    light: string
    dark: string
  }
}

const messageColors: ColorByMessageType = {
  mandatoryVerbatim: {
    light: 'rgba(255, 0, 0, 0.13)',
    dark: 'rgba(255, 0, 0)',
  },
  mandatoryNonVerbatim: {
    light: 'rgba(87, 61, 234, 0.13)',
    dark: 'rgba(87, 61, 234)',
  },
  instructional: {
    light: 'rgba(0, 196, 151, 0.13)',
    dark: 'rgba(0, 196, 151)',
  },
  recommended: {
    light: 'rgba(141, 141, 141, 0.13)',
    dark: 'rgba(141, 141, 141)',
  },
}

export const Message = component({
  preview: (props) => {
    const typeData = props.fields.type

    return (
      <div style={styles.wrapper}>
        <NotEditable>
          <div style={{ marginBottom: '0.5rem' }}>Type:</div>
          <Select
            onChange={(e) => typeData.onChange(e?.value as MessageType)}
            value={typeData.options.find((item) => item.value === typeData.value) || null}
            options={typeData.options}
          />
        </NotEditable>
        <div style={{ ...styles.container, background: messageColors[typeData.value].light }}>
          <NotEditable style={styles.dotContainer}>
            <div style={{ ...styles.dot, background: messageColors[typeData.value].dark }}></div>
          </NotEditable>
          {props.fields.content.element}
        </div>
      </div>
    )
  },
  label: 'Message',
  schema: {
    content: fields.child({
      kind: 'block',
      placeholder: 'Content...',
      formatting: 'inherit',
    }),
    type: fields.select({
      label: 'Type',
      options: messageTypes.map((type) => ({
        label: startCase(type),
        value: type,
      })),
      defaultValue: 'mandatoryVerbatim',
    }),
  },
  chromeless: true,
})
