export interface GetOptions {
  parameters?: Record<string, any> | null
  disableCache?: boolean
  options?: RequestInit
  throttleInterval?: number
}
