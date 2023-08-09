import { type Response } from '../types/response'
import { useDataSend } from '../hooks/use-data-send'

export function usePut<T> ({
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
  return useDataSend('PUT', {
    url,
    body,
    parameters,
    options
  })
}
