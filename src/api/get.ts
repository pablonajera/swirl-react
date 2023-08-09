/* eslint-disable prefer-destructuring */
import { useState, useEffect } from 'react'
import {
  type GetOptions
} from '../types/get-options.js'
import { type Response } from '../types/response.js'
import { cache } from '../utils/cache.js'
import { deepCompare } from '../utils/deep-compare.js'
import { pick } from '../utils/pick.js'
import { throttle } from '../utils/throttle.js'
import { finalizeUrl } from '../utils/url.js'
import { type RequestError } from '../types/errors.js'

export function useGet<T> (
  url: string,
  {
    parameters = null,
    disableCache = false,
    throttleInterval = 2000,
    options = {}
  }: GetOptions = {}
): Response<T> {
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

  const [data, setData] = useState<T>()
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState<RequestError>()
  const [statusCode, setStatusCode] = useState<number>()
  const [shouldRun, setShouldRun] = useState(true)

  const trigger = (): void => {
    setShouldRun(true)
  }

  if (!disableCache && cache.has(finalUrl)) {
    setData(cache.get(finalUrl))
    setLoading(false)
  }

  useEffect(() => {
    if (shouldRun) {
      throttle({
        name: finalUrl,
        run: () => {
          fetch(finalUrl, {
            method: 'GET',
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
              if (!deepCompare(responseData, data)) {
                setData(responseData)
                setError(undefined)
                if (!disableCache) {
                  cache.set(finalUrl, responseData)
                }
              }
            })
            .catch((apiError) => {
              setError(apiError)
              setData(undefined)
            })
            .finally(() => {
              setLoading(false)
            })
        },
        wait: throttleInterval
      })
    }
    setShouldRun(false)
  }, [shouldRun])

  return {
    data,
    isLoading,
    error,
    statusCode,
    trigger
  }
}
