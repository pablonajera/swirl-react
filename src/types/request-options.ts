import { type RequestError } from './errors'

export interface RequestOptions {
  url: string
  method: 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  parameters?: Record<string, any> | null
  body?: any
  options?: RequestInit
  setData: (data: any) => void
  setLoading: (loading: boolean) => void
  setError: (error: RequestError | null) => void
  setStatusCode: (statusCode: number) => void
}
