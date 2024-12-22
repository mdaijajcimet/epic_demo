/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, Fragment, useState } from 'react'
import { Button } from '@keystone-ui/button'
import {
  TextInput,
  Checkbox,
  Select,
  FieldContainer,
  FieldLabel,
  FieldDescription,
} from '@keystone-ui/fields'
import { MinusCircleIcon, EditIcon } from '@keystone-ui/icons'
import { Table, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { isNil, isObject, size } from 'lodash'
import { nanoid } from 'nanoid'
import { useToasts } from '@keystone-ui/toast'
import { Text } from '@keystone-ui/core'

import { Option } from '../../../types'
import { JsonTableElement, JsonTableProps, ListValues } from './typeDefs'
import classes from './jsonTable.module.css'
import { getInitialInputs, getLabel, getTableValue } from './utils'

export const JsonTable = ({
  field,
  value: initialValues,
  onChange,
  autoFocus,
  fields: initialFields = [],
}: JsonTableProps) => {
  const { addToast } = useToasts()
  const [fields, setFields] = useState(initialFields)
  const [values, setValues] = useState<ListValues>([])
  const [inputs, setInputs] = useState(getInitialInputs(fields))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [updateDataKey, setUpdateDataKey] = useState<string | null>(null)
  const isAddMode = isNil(updateDataKey)

  useEffect(() => {
    const parsedValues = initialValues ? JSON.parse(initialValues) : []
    setValues(parsedValues)
    if (!size(parsedValues)) setIsFormOpen(true)
  }, [initialValues])

  useEffect(() => {
    const resolveFields = async () => {
      const resolvingFields = initialFields.map(async (field) => {
        if (field.getOptions) {
          field.options = await field.getOptions()
        }
        return field
      })
      const resolvedFields = await Promise.all(resolvingFields)
      setFields(resolvedFields)
    }

    resolveFields()
  }, [initialFields])

  const toastMessage = (message: string) =>
    addToast({
      message: 'Please save changes to save data (To reset press Reset Changes)',
      title: message,
      tone: 'positive',
    })

  const handleFormOpen = () => setIsFormOpen(true)
  const handleFormClose = () => setIsFormOpen(false)

  const handleinputsChange = (e: any, name: string, element: JsonTableElement = 'input') => {
    const getValue = () => {
      switch (element) {
        case 'checkbox':
          return e?.target?.checked
        case 'select':
          return e?.value
        default:
          return e?.target?.value
      }
    }
    setInputs((prev) => ({
      ...prev,
      [name]: getValue(),
    }))
  }

  const handleReset = ({ closeForm = true } = {}) => {
    setInputs(getInitialInputs(fields))
    setUpdateDataKey(null)
    if (closeForm) {
      handleFormClose()
    }
    setErrors({})
  }

  const handleSave = () => {
    if (onChange) {
      setErrors({})
      const errorsFound: Record<string, string> = {}
      fields.forEach(({ isRequired, name, label }) => {
        if (isRequired && (isNil(inputs[name]) || inputs[name] === '')) {
          errorsFound[name] =
            (isObject(isRequired) && isRequired.message) || `${getLabel(name, label)} is required field`
        }
      })
      if (size(errorsFound)) {
        setErrors(errorsFound)
        return
      }
      let updatedData
      if (isAddMode) {
        updatedData = [...values, { ...inputs, key: nanoid() }]
      } else {
        updatedData = values.map((item) => {
          if (item.key === updateDataKey) return { ...inputs }
          return item
        })
      }
      onChange(JSON.stringify(updatedData))
      toastMessage(isAddMode ? 'Entry added' : 'Data Updated')
      handleReset({ closeForm: !isAddMode })
    }
  }

  const handleEdit = (dataKey: string) => {
    const data = values.find((item) => item.key === dataKey)
    if (data) {
      setUpdateDataKey(dataKey)
      setInputs(data)
    }
    handleFormOpen()
  }

  const handleDelete = (dataKey: string) => {
    if (onChange) {
      onChange(JSON.stringify(values.filter((val) => val.key !== dataKey)))
    }
    toastMessage('Data Deleted')
  }

  const getForm = () => (
    <div className={classes['form-container']}>
      {fields.map(({ label: _label, name, element = 'input', type, options = [], description }) => {
        const label = getLabel(name, _label)
        const hideLabel = element === 'checkbox'
        const commonProps = {
          name,
          autoFocus,
          onChange: (e: any) => handleinputsChange(e, name, element),
        }

        const getInputComp = () => {
          switch (element) {
            case 'checkbox':
              return (
                <Checkbox checked={inputs[name] as boolean} {...commonProps}>
                  {label}
                </Checkbox>
              )
            case 'select':
              return (
                <Select
                  value={(options.find((opt) => opt.value === inputs[name]) || null) as Option}
                  options={options}
                  isClearable
                  {...commonProps}
                />
              )
            default:
              return <TextInput {...commonProps} value={(inputs[name] || '') as string} type={type} />
          }
        }

        return (
          <div className={classes['input-container']}>
            {!hideLabel ? <FieldLabel as="legend">{label}</FieldLabel> : null}
            {description && <FieldDescription id={description}>{description}</FieldDescription>}
            {getInputComp()}
            {errors[name] && <Text color="red600" size="small">{`Error: ${errors[name]}`}</Text>}
          </div>
        )
      })}
    </div>
  )

  const getTable = () =>
    values.length ? (
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        className={classes['table-container']}
      >
        <Table.Thead>
          <Table.Tr>
            {fields.map((field) => (
              <Table.Th>{field.tableHeader || getLabel(field.name, field.label)}</Table.Th>
            ))}
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {values.map((val) => {
            return (
              <Table.Tr key={val.key as string}>
                {fields.map((field) => (
                  <Table.Td>{getTableValue(field, val)}</Table.Td>
                ))}

                {onChange && (
                  <Table.Td>
                    <Button size="small" onClick={() => handleEdit(val.key as string)}>
                      <EditIcon size="small" color="blue" />
                    </Button>
                    <Button size="small">
                      <MinusCircleIcon
                        size="small"
                        color="red"
                        onClick={() => handleDelete(val.key as string)}
                      />
                    </Button>
                  </Table.Td>
                )}
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    ) : null

  return (
    <MantineProvider>
      <FieldContainer className={classes['main-wrapper']}>
        <FieldLabel>{field.label}</FieldLabel>
        {field.description && <FieldDescription id={field.description}>{field.description}</FieldDescription>}

        {onChange && isFormOpen && getForm()}

        <div className={classes['btn-container']}>
          {isFormOpen ? (
            <Fragment>
              <Button onClick={handleSave}>{isAddMode ? 'Save' : 'Update'} Data</Button>
              <Button onClick={() => handleReset()}>Close</Button>
              <Button onClick={() => handleReset({ closeForm: false })}>Clear</Button>
            </Fragment>
          ) : (
            <Button onClick={handleFormOpen}>Add new Entry</Button>
          )}
        </div>

        {getTable()}
      </FieldContainer>
    </MantineProvider>
  )
}
