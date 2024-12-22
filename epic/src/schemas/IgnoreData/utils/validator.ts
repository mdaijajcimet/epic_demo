import validateEmail from '../../../libs/validateEmail'
import { validateIPAddress, validateIPRange } from '../../../libs/validateIPAddress'

export const namePattern = /^[A-Za-zÀ-ÿ'-\s]*$/
export const phonePattern = /^04[0-9]{8}$/g
export const domainPattern =
  /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/

export const countryPattern = /^[a-zA-Z ]*$/

export const isValidParam = (param: string, regex: RegExp): boolean => {
  return regex.test(param)
}

export const getDataValidation = (parameter: string, inputData: string) => {
  const parameterSlug = parameter?.replace(/\s*/g, '').toLowerCase()
  const errormsg =
    parameterSlug === 'iprange'
      ? `Valid IP range required with coma [ex: 128.0.0.0, 128.0.0.10]`
      : `Valid ${parameter} required`
  let valid
  const data = inputData.trim()
  if (!data) return { valid: false, error: errormsg }
  switch (parameterSlug.toLowerCase()) {
    case 'email': {
      valid = validateEmail(data)
      break
    }
    case 'name': {
      valid = isValidParam(data, namePattern)
      break
    }
    case 'phone': {
      valid = isValidParam(data, phonePattern)
      break
    }
    case 'domain': {
      valid = isValidParam(data, domainPattern)
      break
    }
    case 'ip': {
      valid = validateIPAddress(data)
      break
    }
    case 'iprange': {
      const { invalidIps, invalidLimit } = validateIPRange(data, 2, 2)
      valid = !invalidLimit && !invalidIps.length
      break
    }
    case 'country': {
      valid = isValidParam(data, countryPattern)
      break
    }
    default: {
      valid = true
    }
  }
  return valid ? { valid: true } : { valid: false, error: errormsg }
}
