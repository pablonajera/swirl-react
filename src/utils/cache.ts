import { LocalCache } from '../classes/cache.class.js'

export const cache = new LocalCache({
  maxSize: 100,
  useLocalStorage: true
})
