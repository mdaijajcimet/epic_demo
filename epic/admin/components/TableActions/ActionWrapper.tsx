import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Heading } from '@keystone-ui/core'
import { MantineProvider, Select } from '@mantine/core'
import '@mantine/core/styles.css'
import concat from 'lodash/concat'
import React, { type ReactNode, useMemo, useState } from 'react'

import { HR } from '../../components/Sections/styles'
import type { ActionGroupKey, ActionOptions } from '../../types/tableActions'
import { getActionTables } from '../../utils/tableActions'
import { PermissionWrapper } from '../Sections/common/PermissionWrapper'

type ActionWrapperProps = {
  options: ActionOptions
  heading: ReactNode
  initialSelection: string | null
  actionKey: ActionGroupKey | ActionGroupKey[]
  additionalActionKeys?: ActionGroupKey[]
}

export const ActionWrapper = ({
  options,
  heading,
  initialSelection,
  actionKey,
  additionalActionKeys,
}: ActionWrapperProps) => {
  const extractActionTables = (actionKeys?: ActionGroupKey | ActionGroupKey[]) =>
    (actionKeys &&
      concat([], actionKeys)
        .map((key) => getActionTables(key))
        .flat(1)) ||
    []

  const actionTables = useMemo(() => extractActionTables(actionKey), [actionKey])

  const [selectedAction, setSelectedAction] = useState<string | null>(initialSelection)
  const selectOptions = Object.values(options).map((option) => ({ ...option, value: option.label }))

  const additionActionTables = useMemo(
    () => extractActionTables(additionalActionKeys),
    [additionalActionKeys],
  )

  return (
    <PageContainer header={<Heading type="h3">{heading}</Heading>}>
      <PermissionWrapper
        {...{
          mappedTables: [...actionTables, ...additionActionTables],
          permissionType: 'read',
          options: { shouldRedirect: true },
        }}
      >
        <MantineProvider>
          <Select
            checkIconPosition="right"
            data={selectOptions}
            label="Select Action"
            placeholder="Pick value"
            value={selectedAction}
            onChange={setSelectedAction}
            size="md"
            pt="md"
            maw={400}
          />
          <hr style={HR} />
          {Object.values(selectOptions).map(
            (Option) => selectedAction === Option.value && <Option.Component actionTables={actionTables} />,
          )}
        </MantineProvider>
      </PermissionWrapper>
    </PageContainer>
  )
}
