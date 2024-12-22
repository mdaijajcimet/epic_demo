type FetchIngestorOptions = {
  shouldIncludeData?: boolean
}

const fetchIngestorAPI = async (
  route: string,
  body = {} as Record<string, unknown>,
  options?: FetchIngestorOptions,
) => {
  if (!route) {
    console.error('Ingestor Route is required ')
    return null
  }
  try {
    const endpoint = `${process.env.INGESTOR_API_URL}/${route}`
    const { shouldIncludeData } = options || {}
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (response.status !== 200) {
      const err = await response.text()
      console.error(`Ingestor Route [ ${route} ], Status: ${response.status}, Error: ${err}`)
      return {
        success: false,
        message: `Ingestor Route [ ${route} ], Status: ${response.status}, Error: ${err}`,
      }
    }
    const data = shouldIncludeData ? await response.json() : {}
    return { success: true, message: null, ...data }
  } catch (error) {
    console.error(`Ingestor Route [ ${route} ], Error: ${error}`)
    return { success: false, message: `Ingestor Route [ ${route} ], Error: ${error}` }
  }
}

export default fetchIngestorAPI
