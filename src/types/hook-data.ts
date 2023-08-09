import { type RequestError } from '../../dist/pablonajera-swirl-react.cjs'

export interface HookData<T> {
  data: T | undefined
  isLoading: boolean
  error: RequestError | undefined
  statusCode: number | undefined
  shouldRun: boolean
  trigger: () => void
  setData: (data: T) => void
  setLoading: (loading: boolean) => void
  setError: (error: RequestError) => void
  setStatusCode: (statusCode: number) => void
  setShouldRun: (shouldRun: boolean) => void
}
