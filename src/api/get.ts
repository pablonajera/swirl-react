/* eslint-disable prefer-destructuring */
import { useState, useEffect } from 'react'
import {
  type GetOptions,
  type GetOptionsInternal
} from '../types/get-options.js'
import { type Response } from '../types/response.js'
import { cache } from '../utils/cache.js'
import { deepCompare } from '../utils/deep-compare.js'
import { pick } from '../utils/pick.js'
import { throttle } from '../utils/throttle.js'
import { finalizeUrl } from '../utils/url.js'
import { type RequestError } from '../types/errors.js'
import { getHookData, hasHookData, saveHookData } from '../utils/hook-data-cache.js'

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

  const hookData = hasHookData(finalUrl)
    ? getHookData<T>(finalUrl)
    : (() => {
        const [data, setData] = useState<T>()
        const [isLoading, setLoading] = useState(true)
        const [error, setError] = useState<RequestError>()
        const [statusCode, setStatusCode] = useState<number | undefined>(
          undefined
        )
        const [shouldRun, setShouldRun] = useState(true)

        return {
          data,
          isLoading,
          error,
          statusCode,
          shouldRun,
          setData,
          setLoading,
          setError,
          setStatusCode,
          setShouldRun,
          trigger: () => {
            setShouldRun(true)
          }
        }
      })()

  if (hookData != null) {
    saveHookData(finalUrl, hookData)
  }

  useEffect(() => {
    if (hookData?.shouldRun) {
      get<T>({
        finalUrl,
        options: cleanedOptions,
        disableCache,
        throttleInterval,
        hookData
      })
    }
    hookData?.setShouldRun(false)
  }, [hookData?.shouldRun])

  return {
    data: hookData?.data,
    isLoading: hookData?.isLoading ?? true,
    error: hookData?.error,
    statusCode: hookData?.statusCode,
    trigger: hookData?.trigger
  }
}

function get<T> (
  {
    finalUrl,
    options = {},
    disableCache = false,
    throttleInterval,
    hookData
  }: GetOptionsInternal<T>
): void {
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

  if (!disableCache && cache.has(finalUrl)) {
    hookData.setData(cache.get(finalUrl))
    hookData.setLoading(false)
  }

  throttle({
    name: finalUrl,
    run: () => {
      fetch(finalUrl, {
        method: 'GET',
        ...cleanedOptions
      })
        .then(async (apiResponse) => {
          hookData.setStatusCode(apiResponse.status)
          if (apiResponse.ok) {
            const responseData = await apiResponse.json()
            return responseData
          }
          return await Promise.reject(apiResponse)
        })
        .then((responseData) => {
          if (!deepCompare(responseData, hookData.data)) {
            hookData.setData(responseData)
            if (!disableCache) {
              cache.set(finalUrl, responseData)
            }
          }
        })
        .catch((apiError) => {
          hookData.setError(apiError)
        })
        .finally(() => {
          hookData.setLoading(false)
        })
    },
    wait: throttleInterval
  })
}
