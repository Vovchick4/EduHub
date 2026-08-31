import { useSyncExternalStore } from 'react'
import { getTokens, subscribeToAuth } from '../api/auth/tokenStorage'

export function useIsAuthenticated() {
  return useSyncExternalStore(
    subscribeToAuth,
    () => Boolean(getTokens()),
    () => false,
  )
}
