/**
 * This file contains all the custom headers that are used in the application.
 @key {string} FALCON_API_KEY: This header is set in middleware and for internal use only
  @key {string} API_KEY: This header is used for external use
 */
export const CUSTOM_HEADERS = {
  FALCON_API_KEY: 'falcon-api-key', // This header is set in middleware and for internal use only
} as const

export const FALCON_API_HEADERS = () =>
  ({
    [CUSTOM_HEADERS.FALCON_API_KEY]: process.env.CIMET_API_KEY, // This header is set in middleware and for internal use only
  } as const)
