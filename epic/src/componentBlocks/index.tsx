/** @jsxRuntime classic */
/** @jsx jsx */

import { Checkbox } from './Checkbox'
import { ImagesSection } from './ImagesSection'
import { Jobs } from './Jobs'
import { InPageLink } from './InPageLink'
import { Hero } from './Hero'
import { ImageTextGroup } from './ImageTextGroup'
import { CardGroup } from './CardGroup'
import { ListWithImage } from './ListWithImage'
import { Message } from './Message'
import { Cta } from './Cta'
import { Iframe } from './Iframe'
import { TextBox } from './TextBox'
import { Accordian } from './Accordian'
import { CustomEditor } from './CustomEditor'
import { AudioSection } from './Audio'
import { VideoSection } from './Video'

// it's important that this file has a named export called componentBlocks
// schema.Script.ui.views import looks for a named export `componentBlocks`
export const componentBlocks = {
  CardGroup,
  Checkbox,
  Hero,
  ImagesSection,
  ImageTextGroup,
  InPageLink,
  Jobs,
  ListWithImage,
  Message,
  Cta,
  Iframe,
  TextBox,
  Accordian,
  CustomEditor,
  AudioSection,
  VideoSection,
}
