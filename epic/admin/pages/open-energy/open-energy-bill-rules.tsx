import React, { useEffect, useMemo, useRef, useState } from 'react'
import { PageContainer } from '@keystone-6/core/admin-ui/components'
import { Heading } from '@keystone-ui/core'
import { Button } from '@keystone-ui/button'
import { MantineProvider } from '@mantine/core'
import { usePermission } from '../../hooks/usePermission'
import { AllPermissionsVal } from '../../../src/types/access'
import fetchEpicAPI from '../../../src/libs/fetchEpicAPI'
import { PUBLISH_OPEN_ENERGY_RULES } from '../../../src/constants/routesNames'
import { useToasts } from '@keystone-ui/toast'

const CustomBillRulePage = () => {
  const [iframeSrc, setIframeSrc] = useState('/open-energy-bill-rules')
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const { loading, error, hasAccess } = usePermission()
  const handleIframeLoad = () => {
    const iframeDocument = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document

    if (!iframeDocument) {
      setTimeout(handleIframeLoad, 100)
      return // Exit early if the document is not available
    }

    const nextDiv = iframeDocument.getElementById('__next') as HTMLDivElement | null
    if (!nextDiv) {
      setTimeout(handleIframeLoad, 100)
      return // Exit early if nextDiv is not found
    }

    const firstDiv = nextDiv.querySelector('div') as HTMLDivElement | null
    if (!firstDiv) {
      setTimeout(handleIframeLoad, 100)
      return // Exit early if firstDiv is not found
    }

    const mainDiv = firstDiv.querySelector('main') as HTMLDivElement | null
    if (!mainDiv) {
      setTimeout(handleIframeLoad, 100)
      return // Exit early if mainDiv is not found
    }

    mainDiv.style.width = '100vw'
    mainDiv.style.height = '100vh'

    // Apply styles to firstDiv
    firstDiv.style.display = 'flex'

    // Set all child divs within firstDiv to display: none
    Array.from(firstDiv.querySelectorAll('div'))
      .filter((div) => div.parentElement === firstDiv)
      .forEach((child) => {
        ;(child as HTMLDivElement).style.display = 'none'
      })

    // Set all header divs within firstDiv to display: none
    Array.from(firstDiv.querySelectorAll('header'))
      .filter((div) => div.parentElement === firstDiv)
      .forEach((header) => {
        ;(header as HTMLDivElement).style.display = 'none'
      })
  }
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    // Add load event listener to the iframe
    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad)
    }

    // Cleanup listener on component unmount
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad)
      }
    }
  }, [])

  const [currentURL, setCurrentURL] = useState('')

  useEffect(() => {
    const checkURLChange = () => {
      const iframe = iframeRef.current
      if (iframe && iframe.contentWindow) {
        try {
          const newURL = iframe.contentWindow.location.href
          if (newURL !== currentURL) {
            setCurrentURL(newURL)
            handleIframeLoad()
          }
        } catch (error) {
          console.error('Cannot access iframe URL')
        }
      }
    }

    const intervalId = setInterval(checkURLChange, 200) // Check every second

    return () => clearInterval(intervalId) // Cleanup interval on unmount
  }, [currentURL])

  // Function to reload the iframe with the same or a new URL
  const reloadIframe = (newSrc: string) => {
    setIframeSrc(`${newSrc}?ts=${new Date().getTime()}`) // Change the src to reload the iframe
  }
  const { addToast } = useToasts()
  const access = useMemo(() => {
    const permissionObj: Partial<Record<AllPermissionsVal, boolean | null>> = {}
    ;(['write', 'read', 'publish'] as const).forEach((permission) => {
      permissionObj[permission] = hasAccess({
        accessModuleInput: 'openEnergyBillRule',
        permissionType: permission,
      })
    })
    return permissionObj
  }, [loading, error])

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const resp = await fetchEpicAPI(PUBLISH_OPEN_ENERGY_RULES)
      if (!resp.status) {
        throw new Error(resp.message)
      }
      addToast({
        title: `Success`,
        message: 'Published successfully!',
        tone: 'positive',
      })
    } catch (error) {
      const err = error as Error
      addToast({
        title: `Error`,
        message: err.message,
        tone: 'negative',
      })
    } finally {
      setIsPublishing(false)
    }
  }
  if (loading) return null
  return (
    <MantineProvider>
      <PageContainer header={<Heading type="h3">Open Energy Bill Rules</Heading>}>
        <div style={{ margin: '24px' }}>
          {access.read && (
            <Button
              onClick={() => reloadIframe(`/open-energy-bill-rules`)}
              tone="active"
              weight="bold"
              type="submit"
            >
              Go to List
            </Button>
          )}
          <span> </span>
          {access.write && (
            <Button
              onClick={() => reloadIframe(`/open-energy-bill-rules/create`)}
              tone="active"
              weight="bold"
              type="submit"
            >
              Create Rule
            </Button>
          )}
          <span> </span>
          {access.publish && (
            <Button onClick={() => handlePublish()} isDisabled={isPublishing} tone="active" type="submit">
              Publish Rules
            </Button>
          )}
          <iframe
            ref={iframeRef}
            id="e-page"
            src={iframeSrc}
            style={{ width: '100%', height: '600px', border: 'none' }}
            title="Embedded Product List"
          />
        </div>
      </PageContainer>
    </MantineProvider>
  )
}

export default CustomBillRulePage
