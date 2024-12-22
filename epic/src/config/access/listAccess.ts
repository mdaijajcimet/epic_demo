import type { TypeInfo } from '.keystone/types'
import values from 'lodash/values'

import { AccessModuleInput } from '../../types/access'
import { ACCESS_MODULE_MAP } from './accessModules'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LIST_ACCESS_KEY_MAP: Record<keyof TypeInfo<any>['lists'], AccessModuleInput> = {
  // ----------access ---------
  User: ACCESS_MODULE_MAP.access.modules.user,
  Role: ACCESS_MODULE_MAP.access.modules.role,

  //----------- admin --------
  Affiliate: ACCESS_MODULE_MAP.admin.modules.affiliate,
  AuditLog: ACCESS_MODULE_MAP.admin.modules.auditLog,
  CsSite: ACCESS_MODULE_MAP.admin.modules.csSite,
  SubAffiliate: ACCESS_MODULE_MAP.admin.modules.subAffiliate,
  Vertical: ACCESS_MODULE_MAP.admin.modules.vertical,

  // ----------journey----------
  // individual-----
  Script: ACCESS_MODULE_MAP.journey.modules.scripts,

  // form elements------
  FormComponent: ACCESS_MODULE_MAP.journey.modules.formElements,
  FormField: ACCESS_MODULE_MAP.journey.modules.formElements,
  FormOption: ACCESS_MODULE_MAP.journey.modules.formElements,
  FormValidation: ACCESS_MODULE_MAP.journey.modules.formElements,

  // ui elements------
  Attribute: ACCESS_MODULE_MAP.journey.modules.uiElements,
  Component: ACCESS_MODULE_MAP.journey.modules.uiElements,
  Container: ACCESS_MODULE_MAP.journey.modules.uiElements,
  Field: ACCESS_MODULE_MAP.journey.modules.uiElements,
  Filter: ACCESS_MODULE_MAP.journey.modules.uiElements,
  CustomAttribute: ACCESS_MODULE_MAP.journey.modules.uiElements,

  //----------- others --------
  // individual-----
  DialerList: ACCESS_MODULE_MAP.other.modules.dialerList,
  Member: ACCESS_MODULE_MAP.other.modules.members,
  Mirn: ACCESS_MODULE_MAP.other.modules.mirn,
  OpenEnergyBillRule: ACCESS_MODULE_MAP.other.modules.openEnergyBillRule,
  PasswordSetting: ACCESS_MODULE_MAP.other.modules.passwordSetting,
  State: ACCESS_MODULE_MAP.other.modules.state,
  TariffCode: ACCESS_MODULE_MAP.other.modules.tariffCode,

  // commision-----
  RetailerMatrix: ACCESS_MODULE_MAP.other.modules.commision,

  // ignore data------
  IgnoreList: ACCESS_MODULE_MAP.other.modules.ignoreData,
  IgnoreParameter: ACCESS_MODULE_MAP.other.modules.ignoreData,
  IgnoreType: ACCESS_MODULE_MAP.other.modules.ignoreData,
  IgnoreDataContent: ACCESS_MODULE_MAP.other.modules.ignoreData,

  // pages------
  Domain: ACCESS_MODULE_MAP.other.modules.pages,
  DomainConfig: ACCESS_MODULE_MAP.other.modules.pages,
  Page: ACCESS_MODULE_MAP.other.modules.pages,
  PageConfig: ACCESS_MODULE_MAP.other.modules.pages,
  Redirect: ACCESS_MODULE_MAP.other.modules.pages,
  Section: ACCESS_MODULE_MAP.other.modules.pages,
  Tag: ACCESS_MODULE_MAP.other.modules.pages,
  Widget: ACCESS_MODULE_MAP.other.modules.pages,
  Link: ACCESS_MODULE_MAP.other.modules.pages,
  LinkGroup: ACCESS_MODULE_MAP.other.modules.pages,

  // VERTICAL DATA ############################
  // ------ common -----
  // show if any of the upload vertical is present
  CreditScore: {
    OR: [ACCESS_MODULE_MAP.verticals.modules.creditCards, ACCESS_MODULE_MAP.verticals.modules.personalLoan],
  },
  Media: { OR: [...values(ACCESS_MODULE_MAP.verticals.modules), ACCESS_MODULE_MAP.other.modules.pages] },

  // upload groups-------
  UploadCategory: {
    OR: [ACCESS_MODULE_MAP.verticals.modules.creditCards],
  },
  UploadDocument: {
    OR: [ACCESS_MODULE_MAP.verticals.modules.creditCards],
  },

  // lms verticals data------
  Provider: ACCESS_MODULE_MAP.admin.modules.lms,
  Plan: ACCESS_MODULE_MAP.admin.modules.lms,
  Addon: ACCESS_MODULE_MAP.admin.modules.lms,
  AddonField: ACCESS_MODULE_MAP.admin.modules.lms,

  // generic vertical------
  GenericProvider: ACCESS_MODULE_MAP.verticals.modules.generic,
  GenericPlan: ACCESS_MODULE_MAP.verticals.modules.generic,
  GenericAddon: ACCESS_MODULE_MAP.verticals.modules.generic,
  GenericPlanField: ACCESS_MODULE_MAP.verticals.modules.generic,
  CheckBoxContent: ACCESS_MODULE_MAP.verticals.modules.generic,
  Logo: ACCESS_MODULE_MAP.verticals.modules.generic,
  // ------ Individual -----
  // credit Cards------
  ProviderCreditCard: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CreditCard: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CardDetail: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CardFeature: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  Rate: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CreditCardFee: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CCPerk: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  RewardProgram: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CCDocument: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  BalanceTransfer: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  EarnRate: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  OverseasSpend: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CCEligibility: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  Special: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  Reward: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  AdditionalQuestion: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  CCUploadGroup: ACCESS_MODULE_MAP.verticals.modules.creditCards,
  // show if both vertical & formContainer is present
  CCFormContainer: {
    AND: [ACCESS_MODULE_MAP.journey.modules.formElements, ACCESS_MODULE_MAP.verticals.modules.creditCards],
  },

  // health insurancee------
  HIRebate: ACCESS_MODULE_MAP.verticals.modules.healthInsurance,
  HIProvider: ACCESS_MODULE_MAP.verticals.modules.healthInsurance,
  HIFormContainer: {
    AND: [
      ACCESS_MODULE_MAP.journey.modules.formElements,
      ACCESS_MODULE_MAP.verticals.modules.healthInsurance,
    ],
  },
  ProductTier: ACCESS_MODULE_MAP.verticals.modules.healthInsurance,
  HospitalCover: ACCESS_MODULE_MAP.verticals.modules.healthInsurance,
  ExtrasCover: ACCESS_MODULE_MAP.verticals.modules.healthInsurance,
  PaymentFrequency: ACCESS_MODULE_MAP.verticals.modules.healthInsurance,

  // personal loan------
  PLProvider: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PersonalLoan: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLFee: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLFeature: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLLoanDetail: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLPerk: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLEligibility: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLDocument: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLSpecial: ACCESS_MODULE_MAP.verticals.modules.personalLoan,
  PLFormContainer: {
    AND: [ACCESS_MODULE_MAP.journey.modules.formElements, ACCESS_MODULE_MAP.verticals.modules.personalLoan],
  },

  // solar------
  AddonFeature: ACCESS_MODULE_MAP.verticals.modules.solar,
  Battery: ACCESS_MODULE_MAP.verticals.modules.solar,
  BundleFeature: ACCESS_MODULE_MAP.verticals.modules.solar,
  Installer: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerAddon: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerBattery: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerContact: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerInverter: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerLicence: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerSolarPanel: ACCESS_MODULE_MAP.verticals.modules.solar,
  InstallerZone: ACCESS_MODULE_MAP.verticals.modules.solar,
  Inverter: ACCESS_MODULE_MAP.verticals.modules.solar,
  Manufacturer: ACCESS_MODULE_MAP.verticals.modules.solar,
  SolarAddon: ACCESS_MODULE_MAP.verticals.modules.solar,
  SolarAffiliate: ACCESS_MODULE_MAP.verticals.modules.solar,
  SolarBundle: ACCESS_MODULE_MAP.verticals.modules.solar,
  SolarPanel: ACCESS_MODULE_MAP.verticals.modules.solar,
  StateWiseRebate: ACCESS_MODULE_MAP.verticals.modules.solar,

  // bundle--------
  BundleFormContainer: {
    AND: [ACCESS_MODULE_MAP.journey.modules.formElements, ACCESS_MODULE_MAP.verticals.modules.bundle],
  },
}
