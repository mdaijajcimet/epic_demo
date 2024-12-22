import { BaseListTypeInfo, KeystoneContext } from '@keystone-6/core/types'

const validateApiKey = (context?: KeystoneContext<BaseListTypeInfo['all']>) => {
  const apiKey = process.env.API_KEY
  if (apiKey && context?.req?.headers['api-key'] === apiKey) {
    return true
  }
  return false
}

export default validateApiKey
