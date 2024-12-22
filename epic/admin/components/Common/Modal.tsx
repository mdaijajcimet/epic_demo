import React, { ReactNode } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { Modal as MantineModal, Button } from '@mantine/core'

const Modal = ({
  className,
  title,
  buttonText,
  children,
}: {
  className: string
  title: string
  buttonText: string
  children: ReactNode
}) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <div className={className}>
      <MantineModal size="lg" opened={opened} onClose={close} title={title} centered>
        {children}
      </MantineModal>
      <Button onClick={open}>{buttonText}</Button>
    </div>
  )
}

export default Modal
