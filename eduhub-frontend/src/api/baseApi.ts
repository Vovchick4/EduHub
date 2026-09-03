import axios from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './auth/tokenStorage'

// When the frontend runs locally without a .env file, requests must still
// reach Django rather than being sent to the Vite development server.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
})

const refreshClient = axios.create({ baseURL: apiBaseUrl })
let refreshRequest: Promise<string | null> | null = null

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) return null

  refreshRequest ??= refreshClient
    .post<{ access: string; refresh?: string }>('/users/api/token/refresh/', { refresh })
    .then(({ data }) => {
      saveTokens({ access: data.access, refresh: data.refresh ?? refresh })
      return data.access
    })
    .catch(() => {
      clearTokens()
      return null
    })
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config as (typeof error.config & { _retry?: boolean }) | undefined
    const isRefreshRequest = request?.url?.includes('/users/api/token/refresh/')
    if (error.response?.status !== 401 || !request || request._retry || isRefreshRequest) {
      return Promise.reject(error)
    }

    request._retry = true
    const access = await refreshAccessToken()
    if (!access) return Promise.reject(error)

    request.headers.Authorization = `Bearer ${access}`
    return api(request)
  },
)
