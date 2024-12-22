import { graphql } from '@keystone-6/core'
import { type BaseListTypeInfo, type FieldTypeFunc, fieldType } from '@keystone-6/core/types'
import { encrypt } from '../../utils/encryption'
import type { TextFieldConfig, TextFieldMeta } from './types'
import { assertReadIsNonNullAllowed, humanize } from '../utils'

export const encryptedText =
  <ListTypeInfo extends BaseListTypeInfo>({
    isIndexed,
    validation: _validation,
    ...config
  }: TextFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> =>
  (meta) => {
    for (const type of ['min', 'max'] as const) {
      const val = _validation?.length?.[type]
      if (val !== undefined && (!Number.isInteger(val) || val < 0)) {
        throw new Error(
          `The text field at ${meta.listKey}.${meta.fieldKey} specifies validation.length.${type}: ${val} but it must be a positive integer`,
        )
      }
      if (_validation?.isRequired && val !== undefined && val === 0) {
        throw new Error(
          `The text field at ${meta.listKey}.${meta.fieldKey} specifies validation.isRequired: true and validation.length.${type}: 0, this is not allowed because validation.isRequired implies at least a min length of 1`,
        )
      }
    }

    if (
      _validation?.length?.min !== undefined &&
      _validation?.length?.max !== undefined &&
      _validation?.length?.min > _validation?.length?.max
    ) {
      throw new Error(
        `The text field at ${meta.listKey}.${meta.fieldKey} specifies a validation.length.max that is less than the validation.length.min, and therefore has no valid options`,
      )
    }

    const validation = {
      ..._validation,
      length: {
        min: _validation?.isRequired ? _validation?.length?.min ?? 1 : _validation?.length?.min,
        max: _validation?.length?.max,
      },
    }

    // defaulted to false as a zero length string is preferred to null
    const isNullable = config.db?.isNullable ?? false

    const fieldLabel = config.label ?? humanize(meta.fieldKey)

    assertReadIsNonNullAllowed(meta, config, isNullable)

    const mode = isNullable ? 'optional' : 'required'

    const defaultValue = isNullable === false ? '' : undefined

    const resolveInput = (val: string | null | undefined, operation: 'create' | 'update') => {
      if (!val) return operation === 'create' ? defaultValue ?? null : val

      try {
        return encrypt(val)
      } catch (error) {
        console.warn(`couldn't encrpt value`, val)
        return ''
      }
    }

    return fieldType({
      kind: 'scalar',
      mode,
      scalar: 'String',
      default: defaultValue === undefined ? undefined : { kind: 'literal', value: defaultValue },
      index: isIndexed === true ? 'index' : isIndexed || undefined,
      map: config.db?.map,
      extendPrismaSchema: config.db?.extendPrismaSchema,
    })({
      ...config,
      hooks: {
        ...config.hooks,
        async validateInput(args) {
          const val = args.resolvedData[meta.fieldKey]
          if (val === null && (validation?.isRequired || isNullable === false)) {
            args.addValidationError(`${fieldLabel} is required`)
          }
          if (val != null) {
            if (validation?.length?.min !== undefined && val?.length < validation?.length?.min) {
              if (validation?.length?.min === 1) {
                args.addValidationError(`${fieldLabel} must not be empty`)
              } else {
                args.addValidationError(
                  `${fieldLabel} must be at least ${validation?.length?.min} characters long`,
                )
              }
            }
            if (validation?.length?.max !== undefined && val?.length > validation?.length?.max) {
              args.addValidationError(
                `${fieldLabel} must be no longer than ${validation?.length?.max} characters`,
              )
            }
            if (validation?.match && !validation.match.regex.test(val)) {
              args.addValidationError(
                validation.match.explanation || `${fieldLabel} must match ${validation.match.regex}`,
              )
            }
          }

          await config.hooks?.validateInput?.(args)
        },
      },
      input: {
        uniqueWhere: undefined,
        where: undefined,
        create: {
          arg: graphql.arg({
            type: graphql.String,
            defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
          }),
          resolve(val) {
            return resolveInput(val, 'create')
          },
        },
        update: {
          arg: graphql.arg({ type: graphql.String }),
          resolve(val) {
            return resolveInput(val, 'update')
          },
        },
      },
      output: graphql.field({ type: graphql.String }),
      __ksTelemetryFieldTypeName: '@keystone-6/text',
      views: './src/customFields/encryptedText/views',
      getAdminMeta(): TextFieldMeta {
        return {
          displayMode: config.ui?.displayMode ?? 'input',
          shouldUseModeInsensitive: meta.provider === 'postgresql',
          validation: {
            isRequired: validation?.isRequired ?? false,
            match: validation?.match
              ? {
                  regex: {
                    source: validation.match.regex.source,
                    flags: validation.match.regex.flags,
                  },
                  explanation: validation.match.explanation ?? null,
                }
              : null,
            length: { max: validation?.length?.max ?? null, min: validation?.length?.min ?? null },
          },
          isNullable,
        }
      },
    })
  }
