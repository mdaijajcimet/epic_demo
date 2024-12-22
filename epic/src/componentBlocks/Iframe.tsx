/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'
import { useEffect } from 'react'
import styles from './styles/iframe.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField } from './utils'

export const Iframe = component({
  preview: (props) => {
    const {
      ctaLabel,
      ctaLink,
      title,
      description,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      iframeUrl,
      bgColor,
    } = props.fields

    useEffect(() => {
      const iframe = document.getElementById('iframe-comp-container')?.querySelector('iframe')

      if (iframe) {
        iframe.removeAttribute('onLoad')
      }
    }, [])

    return (
      <NotEditable>
        <div className={styles.container} style={{ backgroundColor: bgColor.value }}>
          {title.value && (
            <h2
              className={commonStyles.heading}
              style={{ color: titleFontColor.value, fontSize: `${titleFontSize.value}px` }}
            >
              {title.value}
            </h2>
          )}
          {description.value && (
            <p
              className={commonStyles.description}
              style={{ color: descriptionFontColor.value, fontSize: `${descriptionFontSize.value}px` }}
            >
              {description.value}
            </p>
          )}

          {iframeUrl.value && (
            <div
              className={styles.iframeContainer}
              id="iframe-comp-container"
              dangerouslySetInnerHTML={{
                __html: iframeUrl.value,
              }}
            ></div>
          )}

          {ctaLink.value && (
            <a href={ctaLink.value}>
              <button className={commonStyles.button}>{ctaLabel.value}</button>
            </a>
          )}
        </div>
      </NotEditable>
    )
  },
  label: 'Iframe',
  schema: {
    title: fields.text({ label: 'Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    iframeUrl: fields.text({ label: 'Iframe Url' }),
    ctaLabel: fields.text({ label: 'CTA Label' }),
    ctaLink: fields.text({ label: 'CTA Link' }),
    bgColor: getColorField('Background Color'),
  },
})
