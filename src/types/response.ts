import { type RequestError } from './errors'

export interface Response<T> {
  data: T | null
  isLoading: boolean
  error: RequestError | null
  statusCode: number | null
  trigger?: () => void
}
