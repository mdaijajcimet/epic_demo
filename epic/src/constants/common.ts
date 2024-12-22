export const optionsRange = (
  start: number,
  end: number,
  options: { appendPlus?: boolean; suffix?: string } = {},
) => {
  const { appendPlus, suffix } = options
  const data = []
  for (let i = start; i < end; i++) {
    const value = appendPlus && i === end - 1 ? `${i}+` : i.toString()
    const suffixLabel = suffix ? ` ${i === 1 ? suffix : `${suffix}s`}` : ''
    data.push({ label: `${value}${suffixLabel}`, value })
  }
  return data
}

export const getOptions = (arr: string[] | number[]) =>
  arr.map((item) => ({ label: item.toString(), value: item.toString() }))

export const SPLIT_WITHOUT_SPACE_REGEX = /\s*,\s*|\t|\n/

export const pageQueryFields = `
  slug
  title
  url
  linkLabel
  publishDate
  status
  supportingText
  type
  description
  linkUrl
  subHead
  seoIndex
  content {
    document
  }
  section {
    sectionName
    sectionOrder
    content {
      document
    }
  }`

export const PRISMA_CODE_ITEM_NOT_FOUND = 'P2025'

export const DatePattern =
  /(?:(?:(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2])|(?:29|30)\/(?:0[13-9]|1[0-2])|31\/(?:0[13578]|1[02]))\/[1-9]\d{3}|29\/02(?:\/[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00))/

export const MatchEmptyField = {
  regex: /^(?!\s*$).+/, // This regex ensures the string is not only spaces
  explanation: 'The value cannot be empty or contain only spaces',
}
