import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clearTokens } from './auth/tokenStorage'
import { api } from './baseApi'
import type { Profile } from './type'

export type ProfilePayload = Pick<Profile, 'first_name' | 'last_name' | 'bio'> & {
  avatar?: File | string | null
}

export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
}

const profileApi = {
  current: async () => (await api.get<Profile>('/users/profile/')).data,
  update: async (payload: Partial<ProfilePayload>) => {
    const formData = new FormData()

    if (payload.first_name !== undefined) formData.append('first_name', payload.first_name)
    if (payload.last_name !== undefined) formData.append('last_name', payload.last_name)
    if (payload.bio !== undefined) formData.append('bio', payload.bio)

    if (payload.avatar instanceof File) {
      formData.append('avatar', payload.avatar)
    }

    const { data } = await api.patch<Profile>('/users/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },
  remove: async () => {
    await api.delete('/users/profile/')
  },
}

export function useProfileQuery() {
  return useQuery({ queryKey: profileKeys.current(), queryFn: profileApi.current })
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: (profile) => queryClient.setQueryData(profileKeys.current(), profile),
  })
}

export function useDeleteProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: profileApi.remove,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: profileKeys.all })
      clearTokens()
    },
  })
}