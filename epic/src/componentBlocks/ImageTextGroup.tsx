/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks'
import cx from 'classnames'

import styles from './styles/image-text-group.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField, getListItemText, idField } from './utils'

export const ImageTextGroup = component({
  preview: (props) => {
    const {
      content,
      title,
      description,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      ctaLabel,
      ctaLink,
      bgColor,
      gridLayout,
    } = props.fields

    return (
      <NotEditable>
        <section className={styles.section} style={{ backgroundColor: bgColor.value }}>
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

          <div className={styles.container}>
            {content.elements.map((item, i) => (
              <div key={i}>
                <div
                  className={cx(styles.box, {
                    [`${styles['flexReverse']}`]: i % 2 !== 0,
                  })}
                >
                  <div
                    className={cx(styles.titleParagraphContainer, {
                      [`${styles['gridLayout75']}`]: gridLayout.value === '25/75',
                      [`${styles['gridLayout50']}`]: gridLayout.value === '50/50',
                      [`${styles['gridLayoutParagraph']}`]: gridLayout.value === 'default',
                    })}
                  >
                    <h2 className={commonStyles.title}>{item.fields.title.value}</h2>
                    {item.fields.content.elements.map((p, i) => (
                      <p key={i} className={commonStyles.description}>
                        {p.fields.paragraph.value}
                      </p>
                    ))}
                  </div>
                  {item?.fields.displayImage.value?.data?.file?.url && (
                    <div
                      className={cx(styles.imageWrapper, {
                        [`${styles['gridLayout25']}`]: gridLayout.value === '25/75',
                        [`${styles['gridLayout50']}`]: gridLayout.value === '50/50',
                        [`${styles['gridLayoutImage']}`]: gridLayout.value === 'default',
                      })}
                    >
                      <img
                        src={item?.fields.displayImage.value?.data?.file?.url ?? ''}
                        alt={item?.fields.displayImage.value?.data?.altText ?? ''}
                        className={styles.image}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                {item.fields.linkUrl.value && (
                  <a href={item.fields.linkUrl.value}>
                    <button className={commonStyles.button}>{item.fields.linkLabel.value}</button>
                  </a>
                )}
              </div>
            ))}
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
  label: 'Image Text Group',
  schema: {
    title: fields.text({ label: 'Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    section: fields.select({
      label: 'Section',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'About Us', value: 'aboutUs' },
        { label: 'Steps', value: 'steps' },
      ],
      defaultValue: 'default',
    }),
    bgColor: getColorField('Background Color'),
    gridLayout: fields.select({
      label: 'Grid Layout',
      options: [
        { label: '25/75', value: '25/75' },
        { label: '50/50', value: '50/50' },
        { label: 'Default', value: 'default' },
      ],
      defaultValue: 'default',
    }),
    content: fields.array(
      fields.object({
        id: idField,
        displayImage: fields.relationship({
          label: 'Avatar/Logo/Icon',
          listKey: 'Media',
          selection: 'title file {url} altText',
        }),
        title: fields.text({ label: 'Title' }),
        linkLabel: fields.text({ label: 'Link Label' }),
        linkUrl: fields.text({ label: 'Link URL' }),
        content: fields.array(
          fields.object({
            id: idField,
            paragraph: fields.text({ label: 'Paragraph' }),
          }),
          {
            label: 'Add content',
            itemLabel: (props) =>
              getListItemText({
                item: props?.fields?.paragraph?.value,
                defaultValue: 'Paragraph',
                isModal: true,
              }),
          },
        ),
        textBox: fields.child({
          kind: 'block',
          placeholder: 'Paragraph...',
          formatting: 'inherit',
          links: 'inherit',
        }),
      }),
      {
        label: 'Add image text groups',
        itemLabel: (props) =>
          getListItemText({
            item: props?.fields?.title?.value,
            defaultValue: 'Image text group',
          }),
      },
    ),
    ctaLabel: fields.text({ label: 'CTA Label' }),
    ctaLink: fields.text({ label: 'CTA Link' }),
  },
})
