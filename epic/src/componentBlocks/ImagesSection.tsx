/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'

import styles from './styles/images-section.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField, getListItemText } from './utils'

// A reusable component block that will be used in every section that includes images.
export const ImagesSection = component({
  preview: (props) => {
    const {
      images,
      title,
      description,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      ctaLabel,
      ctaLink,
      bgColor,
    } = props.fields

    return (
      <NotEditable>
        <section className={styles.container} style={{ backgroundColor: bgColor.value }}>
          {title.value && (
            <h2
              className={commonStyles.title}
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
          <div className={styles.images}>
            {images.elements.map((e, i) => {
              const imgData = e.value?.data
              return (
                imgData?.file?.url && (
                  <div key={i} className={styles.imageContainer}>
                    <div className={styles.imageWrapper}>
                      <img
                        className={styles.image}
                        src={imgData?.file.url || ''}
                        alt={imgData?.altText || ''}
                      />
                    </div>
                    <p className={commonStyles.description}>Label: {e.value?.label || ''}</p>
                  </div>
                )
              )
            })}
          </div>
          {ctaLink.value && (
            <a href={ctaLink.value}>
              <button className={commonStyles.button}>{ctaLabel.value}</button>
            </a>
          )}
        </section>
      </NotEditable>
    )
  },
  label: 'Images',
  schema: {
    title: fields.text({ label: 'Section Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Section Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    page: fields.select({
      label: 'Page',
      options: [{ label: 'Home', value: 'home' }],
      defaultValue: 'home',
    }),
    bgColor: getColorField('Background Color'),
    showVerticalProviders: fields.conditional(fields.checkbox({ label: 'Show Vertical Providers' }), {
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
      }),
      false: fields.empty(),
    }),
    images: fields.array(
      fields.relationship({
        label: 'Avatar/Logo/Icon',
        listKey: 'Media',
        selection: 'id title file {url} altText',
      }),
      {
        label: 'Add images',
        itemLabel: (props) =>
          getListItemText({
            item: props?.value?.label,
            defaultValue: 'Image',
          }),
      },
    ),
    ctaLink: fields.text({ label: 'CTA Link' }),
    ctaLabel: fields.text({ label: 'CTA Label' }),
  },
})
