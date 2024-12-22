/* eslint-disable @typescript-eslint/no-unused-vars */
/** @jsxRuntime classic */
/** @jsx jsx */

import { type controller } from '@keystone-6/core/fields/types/text/views'
import type { CardValueComponent, CellComponent, FieldProps } from '@keystone-6/core/types'
import { CellContainer, CellLink } from '@keystone-6/core/admin-ui/components'
import { jsx, Stack } from '@keystone-ui/core'
import { FieldContainer, FieldDescription, FieldLabel } from '@keystone-ui/fields'
import { Editor } from '@tinymce/tinymce-react'
import parse from 'html-react-parser'
import { useState } from 'react'

import { PLUGINS, TOOLBAR } from '../../constants/customEditor'
import { validate } from '../utils/validate'

export const Field = ({
  field,
  value,
  onChange,
  forceValidation,
}: FieldProps<typeof controller>): JSX.Element => {
  const handleEditorChange = (e: string) => onChange?.({ ...value, inner: { value: e, kind: 'value' } })
  const [shouldShowErrors, setShouldShowErrors] = useState(false)
  const validationMessages = validate(value, field.validation, field.label)
  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>{field.description}</FieldDescription>
      <Stack gap="small">
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY ?? ''}
          onEditorChange={handleEditorChange}
          value={value.inner.kind === 'null' ? '' : value.inner.value}
          plugins={PLUGINS}
          toolbar={TOOLBAR}
          onBlur={() => {
            setShouldShowErrors(true)
          }}
        />
        {!!validationMessages.length &&
          (shouldShowErrors || forceValidation) &&
          validationMessages.map((message: string, i: number) => (
            <span key={i} css={{ color: 'red' }}>
              {message}
            </span>
          ))}
      </Stack>
    </FieldContainer>
  )
}

export const Cell: CellComponent = ({ item, field, linkTo }) => {
  const html = parse(item[field.path] + '')
  return linkTo ? <CellLink {...linkTo}>{html}</CellLink> : <CellContainer>{html}</CellContainer>
}
Cell.supportsLinkTo = true

export const CardValue: CardValueComponent = ({ item, field }) => {
  const html = item[field.path] ?? ''
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {parse(html)}
    </FieldContainer>
  )
}
