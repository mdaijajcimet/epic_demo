import { optionsRange, getOptions } from './common'

const titles = ['Miss', 'Ms', 'Mr', 'Sir', 'Mrs', 'Dr', 'Mx']

// Main Options

export const uiComponents = [
  { label: 'Input', value: 'Input' },
  { label: 'CheckBox', value: 'CheckBox' },
  { label: 'Dropdown Select', value: 'Select' },
  { label: 'Polymorphic Select', value: 'PolymorphicSelect' },
  { label: 'Add More Button', value: 'MoreButton' },
  { label: 'Date Input', value: 'DateInput' },
  { label: 'CheckboxButton', value: 'CheckboxButton' },
  { label: 'CheckBoxButtonTabs', value: 'CheckBoxButtonTabs' },
  { label: 'CheckBoxGroup', value: 'CheckBoxGroup' },
  { label: 'CheckBoxInput', value: 'CheckBoxInput' },
  { label: 'CustomInput', value: 'CustomInput' },
  { label: 'DropDownTabs', value: 'DropDownTabs' },
  { label: 'InputWithSlider', value: 'InputWithSlider' },
  { label: 'NameInput', value: 'NameInput' },
  { label: 'RadioButton', value: 'RadioButton' },
  { label: 'RadioButtonGroup', value: 'RadioButtonGroup' },
  { label: 'RadioButtonTabs', value: 'RadioButtonTabs' },
  { label: 'TwoColumnTabs', value: 'TwoColumnTabs' },
  { label: 'AnswersButtons', value: 'AnswersButtons' },
  { label: 'Slider', value: 'Slider' },
  { label: 'StyledFileInput', value: 'StyledFileInput' },
  { label: 'StyledInputMask', value: 'StyledInputMask' },
  { label: 'TextArea', value: 'TextArea' },
  { label: 'Address Bar', value: 'AddressInput' },
  { label: 'Info Bar', value: 'InfoBar' },
  { label: 'ABN Search', value: 'AbnSearch' },
  { label: 'Paragraph', value: 'Paragraph' },
  { label: 'DynamicContent', value: 'DynamicContent' },
  { label: 'ExpenseSection', value: 'ExpenseSection' },
  { label: 'Togglebuttons', value: 'Togglebuttons' },
  { label: 'UploadGroup', value: 'UploadGroup' },
  { label: 'StyledUnitInput', value: 'StyledUnitInput' },
  { label: 'SwitchInputSelect', value: 'SwitchInputSelect' },
  { label: 'BoxDataBucketInput', value: 'BoxDataBucketInput' },
  { label: 'CardPreferenceSelect', value: 'CardPreferenceSelect' },
  { label: 'RowSliderInput', value: 'RowSliderInput' },
  { label: 'AddressDisplaySearch', value: 'AddressDisplaySearch' },
  { label: 'BundleConnectionType', value: 'BundleConnectionType' },
  { label: 'BundleDatePicker', value: 'BundleDatePicker' },
]

// Form Field Options

export const residentialStatus = [
  { label: 'Renting', value: 'renting' },
  { label: 'Home Owner without Mortgage', value: 'homeOwnerWithoutMortgage' },
  { label: 'Home Owner with Mortgage', value: 'homeOwnerWithMortgage' },
  { label: 'Living with parent/relative,', value: 'livingWithParentOrRelative' },
  { label: 'Boarding', value: 'boarding' },
  { label: 'Employer Supplied', value: 'employerSupplied' },
]

export const residencyStatus = [
  { label: 'Visa Holder', value: 'visaHolder' },
  { label: 'Permanent Resident', value: 'permanentResident' },
  { label: 'Australian Citizen', value: 'citizen' },
]

export const idProof = [
  { label: 'Drivers Licence', value: 'driverLicence' },
  { label: 'Australian Passport', value: 'australianPassport' },
  { label: 'Medicare Card', value: 'medicareCard' },
  { label: 'Foreign Passport', value: 'foreignPassport' },
]

export const states = [
  { label: 'ALL', value: 'ALL' },
  { label: 'NSW', value: 'NSW' },
  { label: 'ACT', value: 'ACT' },
  { label: 'NT', value: 'NT' },
  { label: 'QLD', value: 'QLD' },
  { label: 'SA', value: 'SA' },
  { label: 'TAS', value: 'TAS' },
  { label: 'VIC', value: 'VIC' },
  { label: 'WA', value: 'WA' },
]

export const employmentStatus = [
  { label: 'Employed', value: 'employed' },
  { label: 'Self-employed', value: 'selfEmployed' },
  { label: 'Not employed', value: 'unemployed' },
  { label: 'Student', value: 'student' },
]

export const unemployedReason = [
  { label: 'Unemployed', value: 'unemployed' },
  { label: 'Pensioner', value: 'pensioner' },
  { label: 'Home carer', value: 'homeCarer' },
  { label: 'Retired', value: 'retired' },
]

export const workType = [
  { label: 'Full time', value: 'fullTime' },
  { label: 'Casual', value: 'casual' },
  { label: 'Part Time', value: 'partTime' },
  { label: 'Contractor / Consultant', value: 'contractor' },
]

export const industryOptions = [
  {
    label: 'Accomodation, Cafes and Restaurants',
    value: 'accomodation',
  },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Forestry and Fishing', value: 'forestryAndFishing' },
  { label: 'Communication Services', value: 'communicationServices' },
  { label: 'Construction', value: 'construction' },
  {
    label: 'Cultural and Recreational Services',
    value: 'culturalAndRecreationalServices',
  },
  { label: 'Education', value: 'education' },
  { label: 'Electricity, Gas and Water', value: 'electricityGasAndwater' },
  { label: 'Financial and Insurance', value: 'financeAndInsurance' },
  {
    label: 'Government Administration and Defence',
    value: 'governmentAdministrationAndDefense',
  },
  { label: 'Healthcare and social assistance ', value: 'healthAndcommunityServices' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Mining', value: 'mining' },
  { label: 'Non Working', value: 'nonWorking' },
  { label: 'Personal and Other Services', value: 'personalAndOtherServices' },
  { label: 'Property and Business Services', value: 'propertyAndBusinessServices' },
  { label: 'Retail Trade', value: 'retailTrade' },
  { label: 'Transport and Storage', value: 'transportAndstorage' },
  { label: 'Wholesale Trade', value: 'wholesaleTrade' },
  {
    label: 'Information technology',
    value: 'informationTechnology',
  },
]

export const incomeType = [
  { label: 'Salary', value: 'salary' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Overtime', value: 'overtime' },
  { label: 'Rental Income', value: 'rentalIncome' },
  { label: 'Superannuation', value: 'superannuation' },
  { label: 'Dividend Income', value: 'dividendIncome' },
  { label: 'Commission', value: 'commission' },
  { label: 'Government Allowances', value: 'governmentAllowances' },
]

export const frequencyOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Annually', value: 'yearly' },
]

export const yesNoOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

export const reductionOptions = [
  { label: 'Job loss or unemployment', value: 'Job loss or unemployment' },
  { label: 'Salary reduction or pay cuts', value: 'Salary reduction or pay cuts' },
  { label: 'Health or medical issues', value: 'Health or medical issues' },
  {
    label: 'Retirement or planned career change',
    value: 'Retirement or planned career change',
  },
]

export const cardColors = [
  { label: 'Green', value: 'G' },
  { label: 'Yellow', value: 'Y' },
  { label: 'Blue', value: 'B' },
]

export const maritalStatus = [
  { label: 'Single', value: 'single' },
  { label: 'Married', value: 'married' },
  { label: 'Divorced', value: 'divorced' },
  { label: 'Defacto', value: 'defacto' },
  { label: 'Widowed', value: 'widowed' },
  { label: 'Separated', value: 'separated' },
]

export const assetOptions = [
  { label: 'Saving Account', value: 'savingsAccount' },
  { label: 'Term Deposits', value: 'termDeposits' },
  { label: 'Properties', value: 'properties' },
  { label: 'Car', value: 'car' },
  { label: 'Shares', value: 'shares' },
  { label: 'Caravans/Boats', value: 'caravans' },
  { label: 'Managed Funds', value: 'managedFunds' },
  { label: 'Superannuation Or Super Funds', value: 'superannuation' },
  { label: 'Home Contents Etc', value: 'homeContents' },
]

export const liabilityOptions = [
  { label: 'Home Loan', value: 'homeLoan', category: 'loan' },
  { label: 'Personal Loan', value: 'personalLoan', category: 'loan' },
  { label: 'Credit Card', value: 'creditCard', category: 'card' },
  { label: 'Store Card', value: 'storeCard', category: 'card' },
  { label: 'Lines Of Credit', value: 'linesOfCredit', category: 'loan' },
  { label: 'Lease', value: 'lease', category: 'loan' },
  { label: 'Vehicle Loan', value: 'vehicleLoan', category: 'loan' },
  { label: 'Tertiary Study Loans', value: 'tertiaryStudyLoans', category: 'loan' },
  { label: 'Overdraft', value: 'overdraft', category: 'overdraft' },
  { label: 'Other Loans', value: 'otherLoans', category: 'loan' },
]

export const creditLimitOptions = [
  { label: 'Maximum Limit', value: 'maximum' },
  { label: 'Preferred Limit', value: 'preferred' },
]

export const paymentMethodOptions = [
  { label: 'Electronic Fund Transfer', value: 'electronicFundTransfer' },
  { label: 'BPAY', value: 'bpay' },
]

const uploadOptions = [
  { label: 'ID Proofs', value: 'idProof' },
  { label: 'Employment Proofs', value: 'employmentProof' },
  { label: 'Income Proofs', value: 'incomeProof' },
  { label: 'Assets Proofs', value: 'assetProof' },
]

const idProofUploadOptions = [
  { label: 'Driver License', value: 'driverLicense' },
  { label: 'Australian Passport', value: 'australianPassport' },
  { label: 'Foreign Passport', value: 'foreignPassport' },
  { label: 'Medicare Card', value: 'medicareCard' },
]

const employmentProofUploadOptions = [
  { label: 'Letter of employment', value: 'letterOfEmployment' },
  { label: 'Signed employment contract', value: 'signedEmploymentContract' },
]

const incomeProofUploadOptions = [
  { label: 'Bank Statement for last 3 months', value: 'bankStatement' },
  { label: 'Latest consecutive payslips', value: 'latestConsecutivePayslips' },
  { label: 'Centrelink online statement', value: 'centrelinkOnlineStatement' },
]

const assetProofUploadOptions = [
  {
    label: 'A shareholding certificate, current dividend statement or notice',
    value: 'shareholdingCertificate',
  },
  {
    label: 'Most recent managed fund statement or notice',
    value: 'recentManagedFundStatement',
  },
  { label: 'A term deposit certificate', value: 'termDepositCertificate' },
  { label: 'A letter from a financial planner', value: 'letterFromFinancialPlanner' },
  { label: 'Most recent tax return', value: 'recentTaxReturn' },
]

const relationOptions = [
  {
    label: 'Father',
    value: 'father',
  },
  {
    label: 'Mother',
    value: 'mother',
  },
  {
    label: 'Brother',
    value: 'brother',
  },
  {
    label: 'Sister',
    value: 'sister',
  },
  {
    label: 'Husband',
    value: 'husband',
  },
  {
    label: 'Wife',
    value: 'wife',
  },
  {
    label: 'Son',
    value: 'son',
  },
  {
    label: 'Daughter',
    value: 'daughter',
  },
  {
    label: 'Other',
    value: 'other',
  },
]

export const bankOptions = [
  { label: 'American Express', value: 'americanExpress' },
  { label: 'ANZ', value: 'anz' },
  { label: 'Australian Military Bank', value: 'australianMilitaryBank' },
  { label: 'Australian Mutual Bank', value: 'australianMutualBank' },
  { label: 'Australian Unity', value: 'australianUnity' },
  { label: 'Auswide Bank', value: 'auswideBank' },
  { label: 'Bank First', value: 'bankFirst' },
  { label: 'Bank Of Melbourne', value: 'bankOfMelbourne' },
  { label: 'Bank Of Us', value: 'bankOfUs' },
  { label: 'Bank SA', value: 'bankSa' },
  { label: 'Bank Vic', value: 'bankVic' },
  { label: 'Bank West', value: 'bankWest' },
  { label: 'Bendigo Bank', value: 'bendigoBank' },
  { label: 'Beyond Bank', value: 'beyondBank' },
  { label: 'BOQ', value: 'boq' },
  { label: 'Citi', value: 'citi' },
  { label: 'Coles', value: 'coles' },
  { label: 'Commonwealth Bank', value: 'commonwealthBank' },
  { label: 'Community First Cu', value: 'communityFirstCu' },
  { label: 'Defence Bank', value: 'defenceBank' },
  { label: 'G&C Mutual Bank', value: 'gAndCMutualBank' },
  { label: 'Geelong Bank', value: 'geelongBank' },
  { label: 'Great Southern Bank', value: 'greatSouthernBank' },
  { label: 'Greater Bank', value: 'greaterBank' },
  { label: 'Heritage Bank', value: 'heritageBank' },
  { label: 'Horizon Bank', value: 'horizonBank' },
  { label: 'HSBC', value: 'hsbc' },
  { label: 'Hume Bank', value: 'humeBank' },
  { label: 'Illawarra Credit Union', value: 'illawarraCreditUnion' },
  { label: 'ING', value: 'ing' },
  { label: 'Kogan Com', value: 'koganCom' },
  { label: 'Latitude Financial Services', value: 'latitudeFinancialServices' },
  { label: 'ME', value: 'me' },
  { label: 'MoneyMe Financial Group', value: 'moneymeFinancialGroup' },
  { label: 'Move Bank', value: 'moveBank' },
  { label: 'NAB', value: 'nab' },
  { label: 'Newcastle Permanent', value: 'newcastlePermanent' },
  { label: 'Northern Inland Cu', value: 'northernInlandCu' },
  { label: 'Peoples Choice', value: 'peoplesChoice' },
  { label: 'Qudos Bank', value: 'qudosBank' },
  { label: 'Regional Australia Bank', value: 'regionalAustraliaBank' },
  { label: 'St. George Bank', value: 'stGeorgeBank' },
  { label: 'Summerland Credit Union', value: 'summerlandCreditUnion' },
  { label: 'Suncorp Bank', value: 'suncorpBank' },
  { label: 'Teachers Mutual Bank', value: 'teachersMutualBank' },
  { label: 'UniBank', value: 'uniBank' },
  { label: 'Westpac', value: 'westpac' },
]

// Multi Options Select

export const formOptions = [
  {
    label: 'States',
    subOptions: states,
  },
  {
    label: 'ID Proof',
    subOptions: idProof,
  },
  {
    label: 'Residency Status',
    subOptions: residencyStatus,
  },
  {
    label: 'Residential Status',
    subOptions: residentialStatus,
  },
  {
    label: 'Title',
    subOptions: getOptions(titles),
  },
  {
    label: 'Employment Status',
    subOptions: employmentStatus,
  },
  {
    label: 'Unemployed Reason',
    subOptions: unemployedReason,
  },
  {
    label: 'Work Type',
    subOptions: workType,
  },
  {
    label: 'Industry Options',
    subOptions: industryOptions,
  },
  {
    label: 'Numbers 6',
    subOptions: optionsRange(0, 6),
  },
  {
    label: 'Numbers 12',
    subOptions: optionsRange(0, 12),
  },
  {
    label: 'Numbers 22',
    subOptions: optionsRange(0, 22),
  },
  { label: 'Years 5+', subOptions: optionsRange(0, 6, { appendPlus: true, suffix: 'Year' }) },
  {
    label: 'Months',
    subOptions: optionsRange(0, 12, { suffix: 'Month' }),
  },
  {
    label: 'Income Type',
    subOptions: incomeType,
  },
  {
    label: 'Frequency Options',
    subOptions: frequencyOptions,
  },
  {
    label: 'Yes / No Options',
    subOptions: yesNoOptions,
  },
  {
    label: 'Reduction Options',
    subOptions: reductionOptions,
  },
  {
    label: 'Marital Status',
    subOptions: maritalStatus,
  },
  {
    label: 'Dependent Options',
    subOptions: optionsRange(0, 6),
  },
  {
    label: 'Card Colors',
    subOptions: cardColors,
  },
  {
    label: 'Assets',
    subOptions: assetOptions,
  },
  {
    label: 'Liabilities',
    subOptions: liabilityOptions,
  },
  {
    label: 'Credit Limit',
    subOptions: creditLimitOptions,
  },
  {
    label: 'Payment Methods',
    subOptions: paymentMethodOptions,
  },
  { label: 'Document Uploads', subOptions: uploadOptions },
  { label: 'Id Proof Uploads', subOptions: idProofUploadOptions },
  {
    label: 'Employment Proof Uploads',
    subOptions: employmentProofUploadOptions,
  },
  {
    label: 'Income Proof Uploads',
    subOptions: incomeProofUploadOptions,
  },
  {
    label: 'Asset Proof Uploads',
    subOptions: assetProofUploadOptions,
  },
  {
    label: 'Relations',
    subOptions: relationOptions,
  },
  {
    label: 'Banks',
    subOptions: bankOptions,
  },
]

export const propertyType = [
  { label: 'Residential', value: 'residential' },
  { label: 'Business', value: 'business' },
]

export const saleType = [
  { label: 'Retention', value: 'retention' },
  { label: 'Acquisition ', value: 'acquisition' },
]

export const energyType = [
  { label: 'Electricity', value: 'electricity' },
  { label: 'Gas ', value: 'gas' },
]

export const moveIn = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

export const financeVerticals = [
  { label: 'Energy', value: 'energy' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Broadband', value: 'broadband' },
  { label: 'Solar', value: 'solar' },
]

export const commisionFilterType = [
  { label: 'Range', value: 'range' },
  { label: 'Move In', value: 'moveIn' },
  { label: 'Plan', value: 'plan' },
]
