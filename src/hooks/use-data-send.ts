import { useState, useEffect } from 'react'
import { makeRequest } from '../utils/make-request'
import { type Response } from '../types/response'
import { type RequestError } from '../types/errors'

export function useDataSend<T> (method: 'POST' | 'PUT' | 'DELETE' | 'PATCH', {
  url,
  body = {},
  parameters = {},
  options = {}
}: {
  url: string
  body?: any
  parameters?: Record<string, any> | null
  options?: RequestInit
}): Response<T> {
  const [data, setData] = useState()
  const [isLoading, setLoading] = useState(true)
  const [shouldRun, setShouldRun] = useState(false)
  const [error, setError] = useState<RequestError>()
  const [statusCode, setStatusCode] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (shouldRun) {
      makeRequest({
        url,
        method,
        body,
        parameters,
        options,
        setData,
        setLoading,
        setError,
        setStatusCode
      })
    }
    setShouldRun(false)
  }, [shouldRun])

  function trigger (): void {
    setShouldRun(true)
  }

  return {
    data,
    isLoading,
    error,
    statusCode,
    trigger
  }
}
