/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'
import { ChevronDownIcon } from '@keystone-ui/icons/icons/ChevronDownIcon'
import { useEffect } from 'react'
import cx from 'classnames'

import { getColorField, getListItemText, idField, pageField } from './utils'
import styles from './styles/hero.module.css'
import commonStyles from './styles/common.module.css'

// Hero Section
export const Hero = component({
  preview: (props) => {
    const {
      fields: {
        description,
        disclaimerText,
        iframeUrl,
        image,
        linkLabel,
        linkUrl,
        title,
        titleFontColor,
        titleFontSize,
        descriptionFontColor,
        descriptionFontSize,
        columnView,
        downArrows,
        breadcrumbs,
        page,
        bgColor,
        multilineDesc,
      },
    } = props

    useEffect(() => {
      const iframe = document.getElementById('iframe-container')?.querySelector('iframe')

      if (iframe) {
        iframe.removeAttribute('onLoad')
      }
    }, [])

    return (
      <NotEditable>
        <section style={{ backgroundColor: bgColor.value }}>
          {breadcrumbs.value && `${page.value} /`}
          <div className={styles.container}>
            <div
              className={cx(styles.titleContainer, {
                [`${styles.columnView}`]: columnView.value,
                [`${styles.titleContainerWithImage}`]: image.value?.data?.file?.url,
              })}
            >
              <h1
                className={cx(commonStyles.heading, {
                  [`${styles['titleWithColumnView']}`]: columnView.value,
                })}
                style={{ color: titleFontColor.value, fontSize: `${titleFontSize.value}px` }}
              >
                {title.value}
              </h1>
              <p
                className={cx(commonStyles.description, {
                  [`${styles['descriptionWithImage']}`]: image.value?.data?.file?.url,
                  [`${styles['descriptionWithColumnView']}`]: columnView.value,
                })}
                style={{ color: descriptionFontColor.value, fontSize: `${descriptionFontSize.value}px` }}
              >
                {description.value}
              </p>
              <ul className={styles.multilineDescWrapper}>
                {multilineDesc.elements.map((desc) => {
                  const { media, text } = desc.fields
                  return (
                    <li className={styles.multilineDesc}>
                      <img src={media?.value?.data?.file?.url} />
                      <p>{text.value}</p>
                    </li>
                  )
                })}
              </ul>

              {linkUrl.value && (
                <a href={linkUrl.value}>
                  <button className={commonStyles.button}>{linkLabel.value}</button>
                </a>
              )}

              {iframeUrl.value && (
                <div
                  className={styles.iframeContainer}
                  id="iframe-container"
                  dangerouslySetInnerHTML={{
                    __html: iframeUrl.value,
                  }}
                ></div>
              )}
              {disclaimerText.value && (
                <p
                  className={styles.disclaimerContainer}
                  style={{ color: descriptionFontColor.value, fontSize: `${descriptionFontSize.value}px` }}
                >
                  {disclaimerText.value}
                </p>
              )}
            </div>

            {image.value?.data?.file?.url && (
              <figure className={styles.figure}>
                <img
                  alt={image.value?.data?.altText ?? ''}
                  src={image.value?.data?.file?.url ?? ''}
                  className={styles.image}
                />
              </figure>
            )}
          </div>
          {downArrows.value && (
            <div className={styles.arrowWrapper}>
              <ChevronDownIcon size={30} />
            </div>
          )}
        </section>
      </NotEditable>
    )
  },
  label: 'Hero',
  schema: {
    title: fields.text({ label: 'Hero Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Hero Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    page: pageField,
    image: fields.relationship({
      label: 'Avatar/Logo/Icon',
      listKey: 'Media',
      selection: 'title file {url} altText',
    }),
    linkLabel: fields.text({ label: 'Link Label' }),
    linkUrl: fields.text({ label: 'Link Url' }),
    iframeUrl: fields.url({ label: 'Iframe URL' }),
    disclaimerText: fields.text({ label: 'Disclaimer Text' }),
    bgColor: getColorField('Background Color'),
    columnView: fields.checkbox({ label: 'Column View' }),
    isSingleColumn: fields.checkbox({ label: 'Is Single Column' }),
    breadcrumbs: fields.checkbox({
      label: 'Breadcrumbs',
      defaultValue: false,
    }),
    downArrows: fields.checkbox({
      label: 'Down Arrows',
      defaultValue: false,
    }),
    multilineDesc: fields.array(
      fields.object({
        id: idField,
        media: fields.relationship({
          label: 'Media',
          listKey: 'Media',
          selection: 'title file {url} altText',
        }),
        text: fields.text({ label: 'Multiline Description' }),
      }),
      {
        label: 'Add multiline description',
        itemLabel: (props) =>
          getListItemText({
            item: props?.fields?.text?.value,
            defaultValue: 'Multiline text item',
          }),
      },
    ),
    enableAddressSearch: fields.conditional(fields.checkbox({ label: 'Enable Address Search' }), {
      true: fields.object({
        affiliate: fields.relationship({
          label: 'Select Affiliate',
          listKey: 'Affiliate',
          selection: 'name label senderID',
        }),
        verticals: fields.array(
          fields.object({
            vertical: fields.relationship({
              label: 'Select Vertical',
              listKey: 'Vertical',
              selection: 'name slug title icon {file {url} altText}',
            }),
          }),
          {
            label: 'Add verticals',
            itemLabel: (props) =>
              getListItemText({
                item: props?.fields?.vertical?.value?.label,
                defaultValue: 'Vertical',
              }),
          },
        ),
        searchPlaceholder: fields.url({ label: 'Enter Search Placeholder' }),
        ctaText: fields.text({ label: 'Enter Cta Text' }),
        isPostcode: fields.checkbox({ label: 'Enable Postcode' }),
        enableManualAddress: fields.conditional(fields.checkbox({ label: 'Enable Manual Address' }), {
          true: fields.object({
            showManualAddressOnError: fields.checkbox({
              label: 'Show Manual Address option if address not found',
            }),
            manualAddressLinkText: fields.text({ label: 'Enter Manual Address Link Text' }),
          }),
          false: fields.empty(),
        }),
      }),
      false: fields.empty(),
    }),
  },
})
