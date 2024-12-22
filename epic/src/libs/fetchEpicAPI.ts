const fetchEpicAPI = async (route: string, body = {} as Record<string, unknown>) => {
  if (!route) {
    console.error('Epic Route is required ')
    return null
  }
  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (response.status !== 200) {
      const err = await response.text()
      return {
        success: false,
        data: null,
        message: `Epic Route [ ${route} ], Status: ${response.status}, Error: ${err}`,
      }
    }
    const data = await response.json()
    return data
  } catch (error) {
    return { success: false, data: null, message: `Epic Route [ ${route} ], Error: ${error}` }
  }
}

export default fetchEpicAPI
