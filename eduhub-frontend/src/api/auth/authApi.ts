import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../baseApi'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../type'
import { getRefreshToken } from './tokenStorage'

export const authApi = {
  login: async (payload: LoginRequest) =>
    (await api.post<LoginResponse>('/users/login/', payload)).data,
  register: async (payload: RegisterRequest) =>
    (await api.post<RegisterResponse>('/users/register/', payload)).data,
  logout: async () => {
    const refresh = getRefreshToken()
    if (refresh) await api.post('/users/api/logout/', { refresh })
  },
}

export function useLoginMutation() {
  return useMutation({ mutationFn: authApi.login })
}
export function useRegisterMutation() {
  return useMutation({ mutationFn: authApi.register })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: authApi.logout, onSettled: () => queryClient.clear() })
}
