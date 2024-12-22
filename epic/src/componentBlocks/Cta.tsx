/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'

import { getColorField, getListItemText, idField, pageField } from './utils'
import styles from './styles/cta.module.css'
import commonStyles from './styles/common.module.css'

// Hero Section
export const Cta = component({
  preview: (props) => {
    const {
      title,
      description,
      ctaLabel,
      ctaLink,
      ctaNumbers,
      bgColor,
      media,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
    } = props.fields

    return (
      <NotEditable>
        <section className={styles.container} style={{ backgroundColor: bgColor.value }}>
          {media.value?.data?.file.url && (
            <img
              className={styles.image}
              src={media.value?.data?.file.url || ''}
              alt={media.value.data.altText}
            />
          )}
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

          {ctaNumbers?.elements.length > 0 && (
            <div className={styles.items}>
              {ctaNumbers.elements.map(({ fields }, i) => (
                <div key={i} className={styles.item}>
                  <h2 className={commonStyles.title}>{fields.title.value}</h2>
                  <p className={commonStyles.description}>{fields.description.value}</p>
                </div>
              ))}
            </div>
          )}

          {ctaLink.value && (
            <a href={ctaLink.value}>
              <button className={commonStyles.button}>{ctaLabel.value}</button>
            </a>
          )}
        </section>
      </NotEditable>
    )
  },
  label: 'CTA',
  schema: {
    media: fields.relationship({
      label: 'Media',
      listKey: 'Media',
      selection: 'title file {url} altText',
    }),
    mediaRedirectLink: fields.url({ label: 'Media Redirection Link' }),
    title: fields.text({ label: 'Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    ctaLink: fields.text({ label: 'Link' }),
    ctaLabel: fields.text({ label: 'Label' }),
    bgColor: getColorField('Background Color'),
    ctaNumbers: fields.array(
      fields.object({
        id: idField,
        title: fields.text({ label: 'Title' }),
        description: fields.text({ label: 'Description' }),
      }),
      {
        label: 'Add CTA numbers',
        itemLabel: (props) =>
          getListItemText({
            item: [props?.fields?.description?.value, props?.fields?.title?.value],
            defaultValue: 'CTA item',
          }),
      },
    ),
    page: pageField,
  },
})
