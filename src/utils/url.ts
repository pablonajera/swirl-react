import { parametrize } from './parametrize'

export function finalizeUrl (url: string, parameters: Record<string, any> | null): string {
  let finalUrl = url
  if (parameters != null) {
    const queryString = parametrize(parameters)
    finalUrl = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
  }
  return finalUrl
}
