import axios from 'axios'
import { FALCON_API_HEADERS } from '../constants/falconCustomHeaders'

export const serverRequestFalcon = async ({
  headers = {},
  query,
  variables,
}: {
  headers?: Record<string, unknown>
  query: string
  variables?: Record<string, unknown>
}) => {
  const falconUrl = process.env.FALCON_API_URL
  const config = {
    method: 'post',
    url: `${falconUrl}/graphql`,
    headers: { ...headers, ...FALCON_API_HEADERS() },
    data: {
      query,
      variables,
    },
  }
  try {
    const response = await axios.request(config)
    // Check for GraphQL errors in the response
    if (response.data.errors) {
      console.error('GraphQL errors:', JSON.stringify(response.data.errors))
      throw new Error(
        `GraphQL errors: ${JSON.stringify(
          response.data.errors?.map((e: Record<string, unknown>) => e.message),
        )}`,
      )
    }

    return { ...response?.data.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', JSON.stringify(error.message))
    }
    throw error // Re-throw the error after logging it
  }
}
