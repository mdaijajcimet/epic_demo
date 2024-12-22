/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { NotEditable, component, fields } from '@keystone-6/fields-document/component-blocks'

import styles from './styles/card-group.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField, getListItemText, idField } from './utils'

export const CardGroup = component({
  preview: (props) => {
    const {
      title,
      description,
      section,
      cards,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      linkLabel,
      linkUrl,
      bgColor,
    } = props.fields
    return (
      <div
        className={styles.container}
        style={{
          backgroundColor: bgColor.value,
        }}
      >
        <NotEditable>
          {title.value && (
            <h2
              className={commonStyles.heading}
              style={{
                color: titleFontColor.value,
                fontSize: `${titleFontSize.value}px`,
              }}
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
          <p>Section: {section.value}</p>
        </NotEditable>

        <div className={styles.cards}>
          {cards.elements.map((card) => {
            const {
              header,
              subHead,
              body,
              person,
              supportingText,
              content,
              thumbnail,
              media,
              link: {
                fields: { label, url },
              },
            } = card.fields
            return (
              <div key={card.key} className={styles.card}>
                <NotEditable>
                  <h3 className={commonStyles.title}>{header.value}</h3>
                  <p className={commonStyles.subTitle}>{subHead.value}</p>
                  <div className={styles.imageWrapper}>
                    {thumbnail.value?.data?.file?.url && (
                      <div>
                        <p>Image 1</p>
                        <img
                          className={styles.image}
                          src={thumbnail.value?.data?.file?.url || ''}
                          alt={header.value}
                        />
                      </div>
                    )}
                    {media.value?.data?.file?.url && (
                      <div>
                        <p>Image 2</p>
                        <img
                          className={styles.image}
                          src={media.value?.data?.file?.url || ''}
                          alt={header.value}
                        />
                      </div>
                    )}
                  </div>
                  <p className={commonStyles.description}>{body.value}</p>
                  <p className={styles.person}>{person.value}</p>
                  <p className={styles.supportingText}>{supportingText.value}</p>
                </NotEditable>

                {content.element}

                <NotEditable>
                  {url.value && (
                    <a href={url.value}>
                      <button className={commonStyles.button}>{label.value}</button>
                    </a>
                  )}
                </NotEditable>
              </div>
            )
          })}
        </div>

        <NotEditable>
          {linkUrl.value && (
            <a href={linkUrl.value}>
              <button className={commonStyles.button}>{linkLabel.value}</button>
            </a>
          )}
        </NotEditable>
      </div>
    )
  },
  label: 'Card Group',
  schema: {
    title: fields.text({ label: 'Group Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    section: fields.select({
      label: 'Section',
      options: [
        { label: 'Products', value: 'products' },
        { label: 'Steps', value: 'steps' },
        { label: 'Industries', value: 'industries' },
        { label: 'Success Stories', value: 'successStories' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Profiles', value: 'profiles' },
        { label: 'Achievements', value: 'achievements' },
        { label: 'Careers -> Domains', value: 'domains' },
        { label: 'Careers -> Core Values', value: 'coreValues' },
        { label: 'Careers -> Latest News', value: 'latestNews' },
        { label: 'Pages', value: 'pages' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Board Members', value: 'boardMembers' },
        { label: 'Contact', value: 'contact' },
      ],
      defaultValue: 'industries',
    }),
    groupImage: fields.relationship({
      label: 'Avatar/Logo/Icon',
      listKey: 'Media',
      selection: 'title file {url} altText',
    }),
    linkUrl: fields.text({ label: 'Link URL' }),
    linkLabel: fields.text({ label: 'Link Label' }),
    bgColor: getColorField('Background Color'),
    cards: fields.array(
      fields.object({
        id: idField,
        page: fields.relationship({
          label: 'Page',
          listKey: 'Page',
          selection:
            'id title description type url linkLabel heroImage {file {url} altText} tags {name} author {name} section {sectionOrder content {document(hydrateRelationships: true)}}',
        }),
        thumbnail: fields.relationship({
          label: 'Avatar/Logo/Icon',
          listKey: 'Media',
          selection: 'title file {url} altText',
        }),
        header: fields.text({
          label: 'Header text',
        }),
        subHead: fields.text({
          label: 'Subhead',
        }),
        body: fields.text({
          label: 'Body',
        }),
        person: fields.text({
          label: 'Person Name',
        }),
        supportingText: fields.text({
          label: 'Supporting text',
        }),
        media: fields.relationship({
          label: 'Avatar/Logo/Icon',
          listKey: 'Media',
          selection: 'title file {url} altText',
        }),
        link: fields.object({
          label: fields.text({ label: 'Link Label' }),
          url: fields.text({ label: 'Link URL' }),
        }),
        content: fields.child({
          kind: 'block',
          placeholder: 'Content',
          formatting: 'inherit',
          links: 'inherit',
        }),
      }),
      {
        label: 'Add cards',
        itemLabel: (props) =>
          getListItemText({
            item: [
              props?.fields?.header?.value,
              props?.fields?.person?.value,
              props?.fields?.page?.value?.data?.title,
              props?.fields?.thumbnail?.value?.label,
              props?.fields?.media?.value?.label,
            ],
            defaultValue: 'Card',
          }),
      },
    ),
  },
})
