export function pick<T, K extends keyof T> (obj: T, keys: K[]): Pick<T, K> {
  const newObj: any = {}
  keys.forEach((key) => {
    if (obj[key] != null) {
      newObj[key] = obj[key]
    }
  })
  return newObj
}
