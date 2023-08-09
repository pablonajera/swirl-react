import { type RequestError } from './errors'

export interface GetOptions {
  parameters?: Record<string, any> | null
  disableCache?: boolean
  options?: RequestInit
  throttleInterval?: number
}

export interface GetOptionsInternal<T> {
  parameters?: Record<string, any> | null
  disableCache?: boolean
  options?: RequestInit
  data: T | undefined
  throttleInterval: number
  setData: (data: T) => void
  setLoading: (loading: boolean) => void
  setError: (error: RequestError) => void
  setStatusCode: (statusCode: number) => void
}
