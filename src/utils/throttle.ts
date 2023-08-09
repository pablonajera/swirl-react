import hash from 'stable-hash'

const throttledKeys = new Set<string>()

export function throttle ({
  name,
  run,
  wait
}: {
  name: string
  run: () => void
  wait: number
}): void {
  const normalizedName = name.trim().toLowerCase().replace(/\/$/, '')
  const key = hash(normalizedName)
  if (!throttledKeys.has(key)) {
    run()
    throttledKeys.add(key)
    setTimeout(() => {
      throttledKeys.delete(key)
    }, wait)
  }
}
