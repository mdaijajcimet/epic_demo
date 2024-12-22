import { Button } from '@keystone-ui/button'
import { TextInput } from '@keystone-ui/fields'
import React, { useState, useCallback, useRef } from 'react'

import { FieldWrapper } from '../components/Sections/styles'

export const useSearch = () => {
  const [searchStr, setSearchStr] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const clearSearch = () => {
    if (searchRef.current) searchRef.current.value = ''
    setSearchStr('')
  }
  const InputComp = useCallback(
    () => (
      <FieldWrapper style={{ display: 'inline-flex' }}>
        <TextInput
          type="search"
          size="medium"
          width="large"
          placeholder="search"
          name="search"
          id="search"
          onChange={(event) => setSearchStr(event.target.value)}
          ref={searchRef}
        />
        <Button onClick={clearSearch}>Clear</Button>
      </FieldWrapper>
    ),
    [],
  )

  return {
    Search: InputComp,
    searchStr,
    clearSearch,
  }
}
