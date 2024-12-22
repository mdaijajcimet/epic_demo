/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { useTheme } from '@keystone-ui/core'
import { Checkbox, FieldContainer, FieldDescription } from '@keystone-ui/fields'
import { FieldProps } from '@keystone-6/core/types'
import { controller } from '@keystone-6/core/fields/types/checkbox/views'

export const Field = ({
  field,
  value,
  onChange,
  autoFocus,
  hideField = false,
}: FieldProps<typeof controller> & { hideField: boolean }) => {
  const { fields, typography, spacing } = useTheme()
  if (hideField) return null
  return (
    <FieldContainer>
      <Checkbox
        autoFocus={autoFocus}
        disabled={onChange === undefined}
        onChange={(event) => {
          onChange?.(event.target.checked)
        }}
        checked={value}
        aria-describedby={field.description === null ? undefined : `${field.path}-description`}
      >
        <span
          css={{
            color: fields.labelColor,
            display: 'block',
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing.xsmall,
            minWidth: 120,
          }}
        >
          {field.label}
        </span>
        <FieldDescription id={`${field.path}-description`}>{field.description}</FieldDescription>
      </Checkbox>
    </FieldContainer>
  )
}
