const ACCESS_TOKEN_KEY = 'eduhub.access-token'
const REFRESH_TOKEN_KEY = 'eduhub.refresh-token'
const listeners = new Set<() => void>()

export type AuthTokens = { access: string; refresh: string }

function notify() {
  listeners.forEach((listener) => listener())
}

function handleStorageChange(event: StorageEvent) {
  if (event.key === ACCESS_TOKEN_KEY || event.key === REFRESH_TOKEN_KEY) notify()
}

export function subscribeToAuth(listener: () => void) {
  listeners.add(listener)
  if (listeners.size === 1) window.addEventListener('storage', handleStorageChange)

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', handleStorageChange)
  }
}

export function getAccessToken() { return localStorage.getItem(ACCESS_TOKEN_KEY) }
export function getRefreshToken() { return localStorage.getItem(REFRESH_TOKEN_KEY) }

export function getTokens(): AuthTokens | null {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  return access && refresh ? { access, refresh } : null
}

export function saveTokens({ access, refresh }: AuthTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  notify()
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  notify()
}
