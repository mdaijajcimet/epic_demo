/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks'
import { useState } from 'react'
import cx from 'classnames'
import { PlusIcon } from '@keystone-ui/icons/icons/PlusIcon'
import { MinusIcon } from '@keystone-ui/icons/icons/MinusIcon'

import styles from './styles/in-page-link.module.css'
import faqStyles from './styles/faq-item.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField, idField } from './utils'

export const InPageLink = component({
  preview: (props) => {
    const {
      title,
      description,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      image,
      links,
      linkLabel,
      linkUrl,
      bgColor,
    } = props.fields
    const [activeIndex, setActiveIndex] = useState<null | number>(null)
    const expand = (i: number) => {
      if (activeIndex === i) {
        return setActiveIndex(null)
      }
      setActiveIndex(i)
    }

    return (
      <section className={styles.section} style={{ backgroundColor: bgColor.value }}>
        <div className={styles.container}>
          {title.value && (
            <NotEditable>
              <h2
                className={commonStyles.heading}
                style={{ color: titleFontColor.value, fontSize: `${titleFontSize.value}px` }}
              >
                {title.value}
              </h2>
            </NotEditable>
          )}
          {description.value && (
            <NotEditable>
              <p
                className={commonStyles.description}
                style={{ color: descriptionFontColor.value, fontSize: `${descriptionFontSize.value}px` }}
              >
                {description.value}
              </p>
            </NotEditable>
          )}

          <div className={styles.contentWrapper}>
            <div className={styles['image-link-container']}>
              {image?.value?.data?.file?.url && (
                <figure className="">
                  <img
                    src={image?.value?.data?.file?.url ?? ''}
                    alt={image?.value?.data?.altText}
                    className={styles.image}
                  />
                </figure>
              )}
              {linkUrl.value && (
                <NotEditable>
                  <a href={linkUrl.value}>
                    <button className={styles.button}>{linkLabel.value}</button>
                  </a>
                </NotEditable>
              )}
            </div>

            <div className={styles['links-container']}>
              {links.elements.map((item, i) => (
                <Accordion
                  key={i}
                  faq={item.fields}
                  active={i === activeIndex}
                  expand={expand}
                  i={i}
                  activeColor={true}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  },
  label: 'In page link',
  schema: {
    title: fields.text({ label: 'Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    image: fields.relationship({
      label: 'Avatar/Logo/Icon',
      listKey: 'Media',
      selection: 'title file {url} altText',
    }),
    linkLabel: fields.text({ label: 'Link Label' }),
    linkUrl: fields.text({ label: 'Link URL' }),
    bgColor: getColorField('Background Color'),
    links: fields.array(
      fields.object({
        id: idField,
        title: fields.child({
          kind: 'block',
          placeholder: 'Title...',
          formatting: 'inherit',
        }),
        content: fields.array(
          fields.object({
            id: idField,
            paragraph: fields.child({
              kind: 'block',
              placeholder: 'Paragraph...',
              formatting: 'inherit',
              links: 'inherit',
            }),
          }),
          {
            label: 'Add accordion content',
            itemLabel: () => `Accordion content`,
          },
        ),
      }),
      {
        label: 'Add accordions',
        itemLabel: () => `Accordion Item`,
      },
    ),
  },
})

type Faq = {
  title: {
    element: React.ReactNode
  }
  content: {
    elements: {
      fields: {
        key: number
        paragraph: {
          element: React.ReactNode
        }
      }
    }[]
  }
}

type AccordionProps = {
  faq: Faq
  active: boolean
  expand: (arg0: number) => void
  i: number
  activeColor?: boolean
}

function Accordion({ faq, active, expand, i, activeColor }: AccordionProps) {
  return (
    <div className={faqStyles.container}>
      <div className={faqStyles.titleWrapper} onClick={() => expand(i)}>
        <div className={cx(faqStyles.title, { [`${faqStyles['title.active']}`]: activeColor && active })}>
          {faq.title.element}
        </div>
        <div className={faqStyles.iconWrapper}>
          {active ? <MinusIcon className={faqStyles.icon} /> : <PlusIcon className={faqStyles.icon} />}
        </div>
      </div>
      <NotEditable>
        <hr className={faqStyles.horizontalLine} />
      </NotEditable>
      <div className={cx(faqStyles.paragraphWrapper, { [`${faqStyles['hidden']}`]: !active })}>
        {faq.content.elements.map((p) => {
          return (
            <div className={faqStyles.paragraph} key={p.fields.key}>
              {p.fields.paragraph.element}
            </div>
          )
        })}
      </div>
    </div>
  )
}
