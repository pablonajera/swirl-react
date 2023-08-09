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

  let data: T | undefined
  let isLoading = true
  let error: RequestError | undefined
  let statusCode: number | undefined
  let shouldRun = true
  let trigger: () => void = () => {}
  let setData: (data: T) => void
  let setLoading: (loading: boolean) => void
  let setError: (error: RequestError) => void
  let setStatusCode: (statusCode: number) => void
  let setShouldRun: (shouldRun: boolean) => void

  if (hasHookData(finalUrl)) {
    const hookData = getHookData<T>(finalUrl)

    data = hookData?.data
    isLoading = hookData?.isLoading ?? true
    error = hookData?.error
    statusCode = hookData?.statusCode
    if ((hookData?.setData) != null) {
      setData = hookData?.setData
    }
    if ((hookData?.setLoading) != null) {
      setLoading = hookData?.setLoading
    }
    if ((hookData?.setError) != null) {
      setError = hookData?.setError
    }
    if ((hookData?.setStatusCode) != null) {
      setStatusCode = hookData?.setStatusCode
    }
    if ((hookData?.shouldRun) != null) {
      shouldRun = hookData?.shouldRun
    }
    if ((hookData?.setShouldRun) != null) {
      setShouldRun = hookData?.setShouldRun
    }
    if ((hookData?.trigger) != null) {
      trigger = hookData?.trigger
    }
  } else {
    const [newData, setNewData] = useState<T>()
    const [newIsLoading, setNewLoading] = useState(true)
    const [newError, setNewError] = useState<RequestError>()
    const [newStatusCode, setNewStatusCode] = useState<number | undefined>(undefined)
    const [newShouldRun, setNewShouldRun] = useState(true)
    data = newData
    isLoading = newIsLoading
    error = newError
    statusCode = newStatusCode
    shouldRun = newShouldRun
    setData = setNewData
    setLoading = setNewLoading
    setError = setNewError
    setStatusCode = setNewStatusCode
    setShouldRun = setNewShouldRun
    trigger = () => {
      setNewShouldRun(true)
    }
    saveHookData(finalUrl, {
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
      trigger
    })
  }

  useEffect(() => {
    if (shouldRun) {
      get<T>({
        finalUrl,
        options: cleanedOptions,
        disableCache,
        data,
        throttleInterval,
        setData,
        setLoading,
        setError,
        setStatusCode
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

function get<T> (
  {
    finalUrl,
    options = {},
    disableCache = false,
    data,
    throttleInterval,
    setData,
    setLoading,
    setError,
    setStatusCode
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
    setData(cache.get(finalUrl))
    setLoading(false)
  }

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
            if (!disableCache) {
              cache.set(finalUrl, responseData)
            }
          }
        })
        .catch((apiError) => {
          setError(apiError)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    wait: throttleInterval
  })
}
