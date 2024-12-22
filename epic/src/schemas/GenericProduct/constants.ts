import { without } from 'lodash'
import type { CardsUI } from './types'

const textFields = ['name', 'label', 'key', 'value']
const textFieldsUI = [...without(textFields, 'name'), 'hasListing']

const numericFields = [...textFields, 'type', 'formatter', 'suffix']
const numericFieldsUI = [...without(numericFields, 'name'), 'hasListing']

const contentFields = ['name', 'content']
const contentFieldsUI = ['content', 'hasListing']

const consentFields = ['name', 'type', 'order', 'validationMessage', 'content']

const commonUI: Omit<CardsUI, 'cardFields'> = {
  displayMode: 'cards',
  linkToItem: true,
  inlineConnect: true,
}
export const cardTextUIBase: CardsUI = {
  ...commonUI,
  inlineCreate: { fields: textFields },
  inlineEdit: { fields: textFieldsUI },
  cardFields: ['label', 'value'],
}

export const cardNumericUIBase: CardsUI = {
  ...commonUI,
  inlineCreate: { fields: numericFields },
  inlineEdit: { fields: numericFieldsUI },
  cardFields: ['label', 'value'],
}

export const cardContentUIBase: CardsUI = {
  ...commonUI,
  inlineCreate: { fields: contentFields },
  inlineEdit: { fields: contentFieldsUI },
  cardFields: ['content'],
}

export const cardConsentUI: CardsUI = {
  ...commonUI,
  inlineCreate: { fields: consentFields },
  inlineEdit: { fields: consentFields },
  cardFields: ['order', 'type', 'content'],
}

export const cardFeatureUI: CardsUI = {
  ...commonUI,
  inlineCreate: { fields: ['name', 'value'] },
  inlineEdit: { fields: ['value', 'hasListing'] },
  cardFields: ['value'],
}
