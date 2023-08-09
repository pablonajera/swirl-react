import hash from 'stable-hash'
import { type HookData } from '../types/hook-data'

const Cache = new Map()

function normalizeKey (key: string): string {
  const normalizedName = key.trim().toLowerCase().replace(/\/$/, '')
  return hash(normalizedName)
}
function add<T> (key: string, data: any): void {
  const normalizedKey = normalizeKey(key)
  Cache.set(normalizedKey, data)
}

function get<T> (key: string): T | undefined {
  const normalizedKey = normalizeKey(key)
  return Cache.get(normalizedKey)
}

function has (key: string): boolean {
  const normalizedKey = normalizeKey(key)
  return Cache.has(normalizedKey)
}

export function saveHookData<T> (
  key: string,
  data: HookData<T>
): void {
  add(key, data)
}

export function getHookData<T> (
  key: string
): HookData<T> | undefined {
  return get(key)
}

export function hasHookData (key: string): boolean {
  return has(key)
}
