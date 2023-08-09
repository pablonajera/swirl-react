import { type HookData } from './hook-data'

export interface GetOptions {
  parameters?: Record<string, any> | null
  disableCache?: boolean
  options?: RequestInit
  throttleInterval?: number
}

export interface GetOptionsInternal<T> {
  finalUrl: string
  disableCache?: boolean
  options?: RequestInit
  throttleInterval: number
  hookData: HookData<T>
}
