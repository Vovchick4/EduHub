import { Navigate, Outlet, useLocation } from 'react-router'
import { useIsAuthenticated } from './useAuthState'

export function RequireAuth() {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}
