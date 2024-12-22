/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'

import styles from './styles/audio-section.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField } from './utils'

// Helper function to determine MIME type
const getAudioMimeType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'mp3':
      return 'audio/mpeg'
    case 'aac':
      return 'audio/aac'
    case 'wav':
      return 'audio/wav'
    case 'flac':
      return 'audio/flac'
    case 'ogg':
      return 'audio/ogg'
    default:
      return ''
  }
}

export const AudioSection = component({
  preview: (props) => {
    const {
      title,
      description,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      audioFile,
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
          {audioFile.value?.data?.file?.url && (
            <div className={styles.audioContainer}>
              <div className={styles.audioWrapper}>
                <audio controls>
                  <source
                    src={audioFile.value?.data?.file?.url}
                    type={getAudioMimeType(audioFile.value?.data?.file?.url)}
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          )}
        </section>
      </NotEditable>
    )
  },
  label: 'Audio',
  schema: {
    title: fields.text({ label: 'Section Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Section Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    bgColor: getColorField('Background Color'),
    audioFile: fields.relationship({
      label: 'Audio File',
      listKey: 'Media',
      selection: 'id title file {url} altText',
    }),
  },
})
