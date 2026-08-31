import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './baseApi'
import type { CourseDetail, CourseList } from './type'

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type CoursePayload = Pick<CourseList, 'name' | 'description' | 'preview'>

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (page: number) => [...courseKeys.lists(), { page }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: number) => [...courseKeys.details(), id] as const,
}

const coursesApi = {
  list: async (page = 1) => (
    await api.get<PaginatedResponse<CourseList>>('/courses/courses/', { params: { page } })
  ).data,
  detail: async (id: number) => (await api.get<CourseDetail>(`/courses/courses/${id}/`)).data,
  create: async (payload: CoursePayload) => (await api.post<CourseDetail>('/courses/courses/', payload)).data,
  update: async ({ id, payload }: { id: number; payload: Partial<CoursePayload> }) => (
    await api.patch<CourseDetail>(`/courses/courses/${id}/`, payload)
  ).data,
  remove: async (id: number) => { await api.delete(`/courses/courses/${id}/`) },
  enroll: async (id: number) => (
    await api.post<{ detail: string; enrolled: boolean }>(`/courses/api/courses/${id}/enroll/`)
  ).data,
}

export function useCoursesQuery(page = 1) {
  return useQuery({
    queryKey: courseKeys.list(page),
    queryFn: () => coursesApi.list(page),
    placeholderData: keepPreviousData,
  })
}

export function useCourseQuery(id: number) {
  return useQuery({ queryKey: courseKeys.detail(id), queryFn: () => coursesApi.detail(id) })
}

export function useCreateCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coursesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
  })
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coursesApi.update,
    onSuccess: (_, { id }) => Promise.all([
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) }),
    ]),
  })
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coursesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
  })
}

export function useEnrollCourseMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: coursesApi.enroll,
    onSuccess: (_, id) => Promise.all([
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) }),
    ]),
  })
}
