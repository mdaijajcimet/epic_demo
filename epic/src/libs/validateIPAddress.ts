import { SPLIT_WITHOUT_SPACE_REGEX } from '../constants/common'

export const ip4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const ip6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

export const validateIPAddress = (queryIP: string): 'IPv4' | 'IPv6' | false => {
  if (!queryIP.length || queryIP.length > 39) return false
  if (queryIP.includes('.')) return ip4.test(queryIP) && 'IPv4'
  if (queryIP.includes(':')) return ip6.test(queryIP) && 'IPv6'
  return false
}
//TODO: validate same type ip
export const validateIPRange = (
  IPRange: string,
  minLimit = 2,
  maxLimit?: number,
): { invalidIps: string[]; invalidLimit: boolean } => {
  const all_IPs = IPRange.trim().split(SPLIT_WITHOUT_SPACE_REGEX)

  if (all_IPs.length < minLimit || (maxLimit && all_IPs.length > maxLimit))
    return { invalidLimit: true, invalidIps: [] }
  const invalidIps: string[] = []

  all_IPs.forEach((ip) => !validateIPAddress(ip) && invalidIps.push(ip))

  return { invalidIps, invalidLimit: false }
}
