/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { DatePicker, Radio, TextInput, TextArea } from '@keystone-ui/fields'
import { useToasts } from '@keystone-ui/toast'
import { omit, size } from 'lodash'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

import { FieldWrapper } from '../../../admin/components/Sections/styles'
import { isValidURL, generateUrl } from './utils'
import styles from './clickout.module.css'

const TextLayout = ({ labelKey, label, onChange, value, type = 'text', error, ...rest }: any) => {
  return (
    <div key={labelKey} className={styles.fieldLayout}>
      <label htmlFor={labelKey} className={styles.fieldLabel}>
        {label}
      </label>
      <div className={styles.inputText}>
        <TextInput
          type={type}
          name={labelKey}
          onChange={onChange}
          value={value}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  )
}
const clickoutInitialFields = {
  key: '',
  url: '',
  token_type: '',
  token: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
  utm_rm: '',
  utm_rm_source: '',
  utm_rm_date: '',
  gclid: '',
  fbclid: '',
  msclkid: '',
  icvid: '',
  clickout_url: null,
}

export const Field = ({ value: defaultValue, onChange, hideField = false }: any) => {
  const { addToast } = useToasts()
  const [formData, setFormData] = useState(clickoutInitialFields)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (defaultValue) {
      setFormData(JSON.parse(defaultValue))
    } else {
      setFormData(clickoutInitialFields)
    }
  }, [defaultValue])

  if (hideField) return null

  const handleTextInputChange = (event: any) => {
    const { name, value } = event.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
    setIsDirty(true)
  }

  const handleTokenGenerate = (event: any) => {
    const { value } = event.target
    setFormData((prev: any) => ({
      ...prev,
      token_type: value,
    }))
    if (value === 'uniqueToken' && !formData?.token) {
      setFormData((prev: any) => ({
        ...prev,
        token: nanoid(),
      }))
    }
    setIsDirty(true)
  }

  const handleDateChange = (item: string, key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: item,
    }))
    setIsDirty(true)
  }

  const handleResetDate = (key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: null,
    }))
    setIsDirty(true)
  }

  const validateInputs = () => {
    const errorsFound: Record<string, string> = {}
    if (!formData.key) errorsFound.key = 'Key is required!'
    if (!formData.url) errorsFound.url = 'URL is required!'
    if (!formData.token_type) errorsFound.token_type = 'Token Type is required!'
    if (formData.url && !isValidURL(formData.url)) {
      errorsFound.url = 'Please enter valid URL!'
    }
    return errorsFound
  }

  const handleSaveData = () => {
    if (onChange) {
      const errorsFound = validateInputs()
      if (size(errorsFound)) {
        setErrors(errorsFound)
        addToast({
          message: 'Resolve all errors in Clickout Section',
          title: 'ERROR',
          tone: 'negative',
        })
        return
      }

      const url = generateUrl(formData.url, omit(formData, ['url', 'clickout_url']))
      setErrors({})
      onChange(JSON.stringify({ ...formData, clickout_url: url }))
      addToast({
        message: 'Click on Save Changes Now to save data to DB',
        title: 'Data Added to Clickout Fields',
        tone: 'positive',
      })
      setIsDirty(false)
    }
  }

  return (
    <FieldWrapper>
      <hr className={styles.hrLine} />
      <TextLayout
        labelKey="key"
        label="Key"
        value={formData?.key}
        onChange={handleTextInputChange}
        required
        error={errors?.key}
      />
      <TextLayout
        labelKey="url"
        label="URL"
        value={formData?.url}
        onChange={handleTextInputChange}
        required
        error={errors?.url}
      />

      <div key="token_type" className={styles.fieldLayout}>
        <label htmlFor="token_type" className={styles.fieldLabel}>
          Type of Token
        </label>
        <div>
          <div key="token_type" className={styles.radio}>
            <Radio
              name="token_type"
              value="leadId"
              size="medium"
              onChange={handleTextInputChange}
              checked={formData?.token_type === 'leadId'}
            >
              Lead Id
            </Radio>
            <Radio
              name="token_type"
              value="uniqueToken"
              size="medium"
              onChange={handleTokenGenerate}
              checked={formData?.token_type === 'uniqueToken'}
            >
              Unique Token
            </Radio>
          </div>
          {errors?.token_type && <span className={styles.error}>{errors?.token_type}</span>}
        </div>
      </div>
      {formData?.token_type === 'uniqueToken' ? (
        <TextLayout labelKey="token" label="Generated Token" value={formData?.token} readOnly disabled />
      ) : null}

      <TextLayout
        labelKey="utm_source"
        label="UTM Source"
        value={formData?.utm_source}
        onChange={handleTextInputChange}
        error={errors?.utm_source}
      />
      <TextLayout
        labelKey="utm_medium"
        label="UTM Medium"
        onChange={handleTextInputChange}
        value={formData?.utm_medium}
        error={errors?.utm_medium}
      />
      <TextLayout
        labelKey="utm_campaign"
        label="UTM Campaign"
        value={formData?.utm_campaign}
        onChange={handleTextInputChange}
        error={errors?.utm_campaign}
      />
      <TextLayout
        labelKey="utm_term"
        label="UTM Term"
        onChange={handleTextInputChange}
        value={formData?.utm_term}
        error={errors?.utm_term}
      />
      <TextLayout
        labelKey="utm_content"
        label="UTM Content"
        value={formData?.utm_content}
        onChange={handleTextInputChange}
        error={errors?.utm_content}
      />
      <TextLayout
        labelKey="utm_rm"
        label="UTM RM"
        value={formData?.utm_rm}
        onChange={handleTextInputChange}
        error={errors?.utm_rm}
      />
      <TextLayout
        labelKey="utm_rm_source"
        label="UTM RM Source"
        onChange={handleTextInputChange}
        value={formData?.utm_rm_source}
        error={errors?.utm_rm_source}
      />
      <div key="utm_rm_date" className={styles.fieldLayout}>
        <label htmlFor="utm_rm_date" className={styles.fieldLabel}>
          UTM RM Date
        </label>
        <div className={styles.inputText}>
          <DatePicker
            key="utm_rm_date"
            value={formData?.utm_rm_date}
            onUpdate={(item) => handleDateChange(item, 'utm_rm_date')}
            onClear={() => handleResetDate('utm_rm_date')}
          />
          {errors?.utm_rm_date && <span className={styles.error}>{errors?.utm_rm_date}</span>}
        </div>
      </div>
      <TextLayout
        labelKey="gclid"
        label="Gclid"
        onChange={handleTextInputChange}
        value={formData?.gclid}
        error={errors?.gclid}
      />
      <TextLayout
        labelKey="fbclid"
        label="FBClid"
        onChange={handleTextInputChange}
        value={formData?.fbclid}
        error={errors?.fbclid}
      />
      <TextLayout
        labelKey="msclkid"
        label="MSClkid"
        onChange={handleTextInputChange}
        value={formData?.msclkid}
        error={errors?.msclkid}
      />
      <TextLayout
        labelKey="icvid"
        label="ICVID"
        onChange={handleTextInputChange}
        value={formData?.icvid}
        error={errors?.icvid}
      />
      {formData?.clickout_url && !size(errors) ? (
        <div key="clickout_url" className={styles.fieldLayout}>
          <label htmlFor="clickout_url" className={styles.fieldLabel}>
            Generated URL
          </label>
          <div className={styles.inputText}>
            <TextArea name="clickout_url" value={formData?.clickout_url} readOnly disabled />
          </div>
        </div>
      ) : null}
      <hr className={styles.hrLine} />
      <button
        onClick={handleSaveData}
        className={styles.saveButton}
        disabled={!defaultValue || isDirty ? false : true}
      >
        {!defaultValue ? 'Add' : 'Update'} Data
      </button>
    </FieldWrapper>
  )
}
