import type { TextValue, Validation } from '../encryptedText/types'

export function validate(value: TextValue, validation: Validation, fieldLabel: string): string[] {
  // if the value is the same as the initial for an update, we don't want to block saving
  // since we're not gonna send it anyway if it's the same
  // and going "fix this thing that is unrelated to the thing you're doing" is bad
  // and also bc it could be null bc of read access control
  if (
    value.kind === 'update' &&
    ((value.initial.kind === 'null' && value.inner.kind === 'null') ||
      (value.initial.kind === 'value' &&
        value.inner.kind === 'value' &&
        value.inner.value === value.initial.value))
  ) {
    return []
  }

  if (value.inner.kind === 'null') {
    if (validation.isRequired) {
      return [`${fieldLabel} is required`]
    }
    return []
  }

  const val = value.inner.value

  const messages: string[] = []
  if (validation?.length.min !== null && val?.length < validation?.length.min) {
    if (validation?.length.min === 1) {
      messages.push(`${fieldLabel} must not be empty`)
    } else {
      messages.push(`${fieldLabel} must be at least ${validation?.length.min} characters long`)
    }
  }
  if (validation?.length.max !== null && val?.length > validation?.length.max) {
    messages.push(`${fieldLabel} must be no longer than ${validation?.length.max} characters`)
  }
  if (validation.match && !validation.match.regex.test(val)) {
    messages.push(validation.match.explanation || `${fieldLabel} must match ${validation.match.regex}`)
  }
  return messages
}
