type ClickoutParams = {
  key: string
  token_type: string
  token?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  utm_rm?: string
  utm_rm_source?: string
  utm_rm_date?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
  icvid?: string
}

export const generateUrl = (baseUrl: string, params: ClickoutParams): string => {
  const queryParams: string[] = []

  for (const [key, value] of Object.entries(params)) {
    const updatedValue = value?.trim()
    if (!updatedValue) continue
    if (key === 'key') {
      queryParams.push(`${encodeURIComponent('token_type')}=${encodeURIComponent(params.token_type)}`)
      if (params.token_type === 'uniqueToken' && params.token) {
        queryParams.push(`${encodeURIComponent(updatedValue)}=${encodeURIComponent(params.token)}`)
      }
    }
    if (['token_type', 'token'].includes(key)) {
      continue
    }
    queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(updatedValue)}`)
  }

  return `${baseUrl}?${queryParams.join('&')}`
}

export const isValidURL = (url: string) => {
  const pattern = new RegExp(
    '^([a-zA-Z]+:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i',
  )
  return pattern.test(url)
}
