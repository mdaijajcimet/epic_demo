/** @jsxRuntime classic */
/** @jsx jsx */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { component, fields, NotEditable } from '@keystone-6/fields-document/component-blocks'

import styles from './styles/video-section.module.css'
import commonStyles from './styles/common.module.css'
import { getColorField } from './utils'

// Helper function to determine MIME type for video
const getVideoMimeType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'mp4':
      return 'video/mp4'
    case 'mov':
      return 'video/quicktime'
    case 'avi':
      return 'video/x-msvideo'
    case 'mkv':
      return 'video/x-matroska'
    case 'webm':
      return 'video/webm'
    case '3gp':
      return 'video/3gpp'
    default:
      return ''
  }
}

export const VideoSection = component({
  preview: (props) => {
    const {
      title,
      description,
      titleFontColor,
      titleFontSize,
      descriptionFontColor,
      descriptionFontSize,
      videoFile,
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
          {videoFile.value?.data?.file?.url && (
            <div className={styles.audioContainer}>
              <div className={styles.videoWrapper}>
                <video controls className={styles.video}>
                  <source
                    src={videoFile.value?.data?.file?.url}
                    type={getVideoMimeType(videoFile.value?.data?.file?.url)}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </section>
      </NotEditable>
    )
  },
  label: 'Video',
  schema: {
    title: fields.text({ label: 'Section Title' }),
    titleFontColor: getColorField('Title Font Color'),
    titleFontSize: fields.text({ label: 'Title Font Size (in pixel)', defaultValue: '' }),
    description: fields.text({ label: 'Section Description' }),
    descriptionFontColor: getColorField('Description Font Color'),
    descriptionFontSize: fields.text({ label: 'Description Font Size (in pixel)', defaultValue: '' }),
    bgColor: getColorField('Background Color'),
    videoFile: fields.relationship({
      label: 'Video File',
      listKey: 'Media',
      selection: 'id title file {url} altText',
    }),
  },
})
