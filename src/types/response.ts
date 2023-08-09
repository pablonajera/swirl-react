import { type RequestError } from './errors'

export interface Response<T> {
  data: T | undefined
  isLoading: boolean
  error: RequestError | undefined
  statusCode: number | undefined
  trigger?: () => void
}
