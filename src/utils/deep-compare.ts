import hash from 'stable-hash'

export function deepCompare (x: any, y: any): boolean {
  return hash(x) === hash(y)
}
