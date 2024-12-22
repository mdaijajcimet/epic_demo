/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'
import { Editor } from '@tinymce/tinymce-react'
import { PLUGINS, TOOLBAR } from '../constants/customEditor'

export const CustomEditor = component({
  preview: (props) => {
    const field = props.fields.customEditor
    const handleEditorChange = (e: string) => field.onChange(e)

    return (
      <NotEditable>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
          onEditorChange={handleEditorChange}
          value={field.value}
          plugins={PLUGINS}
          toolbar={TOOLBAR}
        />
      </NotEditable>
    )
  },

  label: 'Custom Editor',
  schema: {
    customEditor: fields.text({ label: 'Custom Editor' }),
  },
  chromeless: true,
})
