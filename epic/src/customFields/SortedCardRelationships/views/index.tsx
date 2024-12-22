/** @jsxRuntime classic */
/** @jsx jsx */

import { Fragment, useState } from 'react'

import { Button } from '@keystone-ui/button'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx, Stack, useTheme } from '@keystone-ui/core'
import { FieldContainer, FieldDescription, FieldLabel, FieldLegend } from '@keystone-ui/fields'
import { DrawerController } from '@keystone-ui/modals'
import { type FieldProps, type ListMeta } from '@keystone-6/core/types'
import { Link } from '@keystone-6/core/admin-ui/router'
import { useKeystone, useList } from '@keystone-6/core/admin-ui/context'
import { CreateItemDrawer } from '@keystone-6/core/admin-ui/components'
import { controller } from '@keystone-6/core/fields/types/relationship/views'
import { RelationshipSelect } from '@keystone-6/core/fields/types/relationship/views/RelationshipSelect'
import { Cards } from './Cards'

function LinkToRelatedItems({
  itemId,
  value,
  list,
  refFieldKey,
}: {
  itemId: string | null
  value: FieldProps<typeof controller>['value'] & { kind: 'many' | 'one' }
  list: ListMeta
  refFieldKey?: string
}) {
  function constructQuery({
    refFieldKey,
    itemId,
    value,
  }: {
    refFieldKey?: string
    itemId: string | null
    value: FieldProps<typeof controller>['value'] & { kind: 'many' | 'one' }
  }) {
    if (!!refFieldKey && itemId) {
      return `!${refFieldKey}_matches="${itemId}"`
    }
    return `!id_in="${(value?.value as { id: string; label: string }[])
      .slice(0, 100)
      .map(({ id }: { id: string }) => id)
      .join(',')}"`
  }
  const commonProps = {
    size: 'small',
    tone: 'active',
    weight: 'link',
  } as const

  if (value.kind === 'many') {
    const query = constructQuery({ refFieldKey, value, itemId })
    return (
      <Button {...commonProps} as={Link} href={`/${list.path}?${query}`}>
        View related {list.plural}
      </Button>
    )
  }

  return (
    <Button {...commonProps} as={Link} href={`/${list.path}/${value.value?.id}`}>
      View {list.singular} details
    </Button>
  )
}

export const Field = ({
  field,
  value,
  itemValue,
  autoFocus,
  onChange,
  forceValidation,
}: FieldProps<typeof controller>) => {
  const keystone = useKeystone()
  const foreignList = useList(field.refListKey)
  const localList = useList(field.listKey)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  if (value.kind === 'cards-view') {
    return (
      <FieldContainer as="fieldset">
        <FieldLegend>{field.label}</FieldLegend>
        <FieldDescription id={`${field.path}-description`}>{field.description}</FieldDescription>
        <Cards
          forceValidation={forceValidation}
          field={field}
          id={value.id}
          value={value}
          itemValue={itemValue}
          onChange={onChange}
          foreignList={foreignList}
          localList={localList}
        />
      </FieldContainer>
    )
  }

  if (value.kind === 'count') {
    return (
      <Stack as="fieldset" gap="medium">
        <FieldLegend>{field.label}</FieldLegend>
        <FieldDescription id={`${field.path}-description`}>{field.description}</FieldDescription>
        <div>
          {value.count === 1
            ? `There is 1 ${foreignList.singular} `
            : `There are ${value.count} ${foreignList.plural} `}
          linked to this {localList.singular}
        </div>
      </Stack>
    )
  }

  const authenticatedItem = keystone.authenticatedItem

  return (
    <FieldContainer as="fieldset">
      <FieldLabel as="legend">{field.label}</FieldLabel>
      <FieldDescription id={`${field.path}-description`}>{field.description}</FieldDescription>
      <Fragment>
        <Stack gap="medium">
          <RelationshipSelect
            controlShouldRenderValue
            aria-describedby={field.description === null ? undefined : `${field.path}-description`}
            autoFocus={autoFocus}
            isDisabled={onChange === undefined}
            labelField={field.refLabelField}
            searchFields={field.refSearchFields}
            list={foreignList}
            portalMenu
            state={
              value.kind === 'many'
                ? {
                    kind: 'many',
                    value: value.value,
                    onChange(newItems) {
                      onChange?.({
                        ...value,
                        value: newItems,
                      })
                    },
                  }
                : {
                    kind: 'one',
                    value: value.value,
                    onChange(newVal) {
                      if (value.kind === 'one') {
                        onChange?.({
                          ...value,
                          value: newVal,
                        })
                      }
                    },
                  }
            }
          />
          <Stack across gap="small">
            {onChange !== undefined && !field.hideCreate && (
              <Button
                size="small"
                disabled={isDrawerOpen}
                onClick={() => {
                  setIsDrawerOpen(true)
                }}
              >
                Create related {foreignList.singular}
              </Button>
            )}
            {onChange !== undefined &&
              authenticatedItem.state === 'authenticated' &&
              authenticatedItem.listKey === field.refListKey &&
              (value.kind === 'many'
                ? value.value.find((x) => x.id === authenticatedItem.id) === undefined
                : value.value?.id !== authenticatedItem.id) && (
                <Button
                  size="small"
                  onClick={() => {
                    const val = {
                      label: authenticatedItem.label,
                      id: authenticatedItem.id,
                    }
                    if (value.kind === 'many') {
                      onChange({
                        ...value,
                        value: [...value.value, val],
                      })
                    } else {
                      onChange({
                        ...value,
                        value: val,
                      })
                    }
                  }}
                >
                  {value.kind === 'many' ? 'Add ' : 'Set as '}
                  {authenticatedItem.label}
                </Button>
              )}
            {!!(value.kind === 'many' ? value.value.length : value.kind === 'one' && value.value) && (
              <LinkToRelatedItems
                itemId={value.id}
                refFieldKey={field.refFieldKey}
                list={foreignList}
                value={value}
              />
            )}
          </Stack>
        </Stack>
        {onChange !== undefined && (
          <DrawerController isOpen={isDrawerOpen}>
            <CreateItemDrawer
              listKey={foreignList.key}
              onClose={() => {
                setIsDrawerOpen(false)
              }}
              onCreate={(val) => {
                setIsDrawerOpen(false)
                if (value.kind === 'many') {
                  onChange({
                    ...value,
                    value: [...value.value, val],
                  })
                } else if (value.kind === 'one') {
                  onChange({
                    ...value,
                    value: val,
                  })
                }
              }}
            />
          </DrawerController>
        )}
      </Fragment>
    </FieldContainer>
  )
}
