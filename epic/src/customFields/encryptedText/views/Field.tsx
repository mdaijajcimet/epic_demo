/** @jsxRuntime classic */
/** @jsx jsx */

import { FieldProps } from '@keystone-6/core/types'
import { Button } from '@keystone-ui/button'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx, Stack, useTheme, VisuallyHidden } from '@keystone-ui/core'
import { Checkbox, FieldContainer, FieldDescription, FieldLabel, TextInput } from '@keystone-ui/fields'
import { EyeIcon } from '@keystone-ui/icons/icons/EyeIcon'
import { EyeOffIcon } from '@keystone-ui/icons/icons/EyeOffIcon'
import { useState } from 'react'
import { controller } from '.'
import { FieldWrapper } from '../../../../admin/components/Sections/styles'
import { validate } from '../../utils/validate'

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
  forceValidation,
}: FieldProps<typeof controller>) => {
  const { typography, fields } = useTheme()
  const [shouldShowErrors, setShouldShowErrors] = useState(false)
  const validationMessages = validate(value, field.validation, field.label)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FieldContainer>
      <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>{field.description}</FieldDescription>
      {onChange ? (
        <Stack gap="small">
          (
          <FieldWrapper style={{ display: 'flex' }}>
            <TextInput
              id={field.path}
              autoFocus={autoFocus}
              type={showPassword ? 'text' : 'password'}
              onChange={(event) =>
                onChange({ ...value, inner: { kind: 'value', value: event.target.value } })
              }
              value={value.inner.kind === 'null' ? '' : value.inner.value}
              disabled={value.inner.kind === 'null'}
              onBlur={() => {
                setShouldShowErrors(true)
              }}
              width="medium"
              aria-describedby={field.description === null ? undefined : `${field.path}-description`}
            />
            <Button
              onClick={() => {
                setShowPassword(!showPassword)
              }}
            >
              <VisuallyHidden>{showPassword ? 'Hide Text' : 'Show Text'}</VisuallyHidden>
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </Button>
          </FieldWrapper>
          )
          {field.isNullable && (
            <Checkbox
              autoFocus={autoFocus}
              disabled={onChange === undefined}
              onChange={() => {
                if (value.inner.kind === 'value') {
                  onChange({
                    ...value,
                    inner: {
                      kind: 'null',
                      prev: value.inner.value,
                    },
                  })
                } else {
                  onChange({
                    ...value,
                    inner: {
                      kind: 'value',
                      value: value.inner.prev,
                    },
                  })
                }
              }}
              checked={value.inner.kind === 'null'}
            >
              <span css={{ fontWeight: typography.fontWeight.semibold, color: fields.labelColor }}>
                Set field as null
              </span>
            </Checkbox>
          )}
          {!!validationMessages?.length &&
            (shouldShowErrors || forceValidation) &&
            validationMessages.map((message, i) => (
              <span key={i} css={{ color: 'red' }}>
                {message}
              </span>
            ))}
        </Stack>
      ) : value.inner.kind === 'null' ? null : (
        value.inner.value
      )}
    </FieldContainer>
  )
}
