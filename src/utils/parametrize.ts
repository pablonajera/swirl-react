export function parametrize (params: Record<string, any>): string {
  const queryParams = Object.entries(params)
    .map(
      ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')

  return queryParams
}
