import { type RequestOptions } from '../types/request-options.js'
import { pick } from './pick.js'
import { finalizeUrl } from './url.js'

/**
 * Sets up a request to be made to the API. Updates data using react hooks.
 */
export function makeRequest ({
  url,
  method,
  parameters = {},
  body = {},
  options = {},
  setData,
  setLoading,
  setError,
  setStatusCode
}: RequestOptions): void {
  setLoading(true)
  const cleanedOptions = pick(options, [
    'headers',
    'mode',
    'credentials',
    'cache',
    'redirect',
    'referrer',
    'referrerPolicy',
    'integrity'
  ])

  cleanedOptions.headers = {
    ...cleanedOptions.headers,
    'Content-Type': 'application/json'
  }

  const finalUrl = finalizeUrl(url, parameters)

  fetch(finalUrl, {
    method,
    body: JSON.stringify(body),
    ...cleanedOptions
  })
    .then(async (apiResponse) => {
      setStatusCode(apiResponse.status)
      if (apiResponse.ok) {
        const responseData = await apiResponse.json()
        return responseData
      }
      return await Promise.reject(apiResponse)
    })
    .then((responseData) => {
      setData(responseData)
    })
    .catch((apiError) => {
      setError(apiError)
    })
    .finally(() => {
      setLoading(false)
    })
}
