import Access from './schemas/Access'
import { Affiliate } from './schemas/Affiliate'
import AuditLog from './schemas/AuditLog'
import Commision from './schemas/Commision'
import Common from './schemas/Common'
import CreditCard from './schemas/CreditCard'
import { CsSite } from './schemas/CsSite'
import { DialerList } from './schemas/DialerList'
import Energy from './schemas/Energy'
import FormElements from './schemas/FormElements'
import GenericProduct from './schemas/GenericProduct'
import HealthInsurance from './schemas/HealthInsurance'
import IgnoreData from './schemas/IgnoreData'
import LMS from './schemas/LMS'
import { Media } from './schemas/Media'
import Member from './schemas/Members'
import Page from './schemas/Page'
import PasswordSetting from './schemas/PasswordSetting'
import PersonalLoan from './schemas/PersonalLoan'
import { Script } from './schemas/Script'
import Solar from './schemas/Solar'
import { State } from './schemas/State'
import { SubAffiliate } from './schemas/SubAffiliate'
import UIElements from './schemas/UIElements'
import Upload from './schemas/UploadDocuments'
import { Vertical } from './schemas/Vertical'
import BundleFormContainer from './schemas/Bundle/BundleFormContainer'

export const lists = {
  // individual schemas -----
  Affiliate,
  AuditLog,
  CsSite,
  DialerList,
  Media,
  Member,
  PasswordSetting,
  Script,
  State,
  SubAffiliate,
  Vertical,
  BundleFormContainer,

  // ------ Modules ----------
  ...Access,
  ...Commision,
  ...Common,
  ...FormElements,
  ...IgnoreData,
  ...Page,
  ...UIElements,
  ...Upload,

  // ------- Vertical ---------
  // common -----
  ...GenericProduct,
  ...LMS, // common providers + lms verticals

  // individual -----
  ...CreditCard,
  ...Energy,
  ...HealthInsurance,
  ...PersonalLoan,
  ...Solar,
}
