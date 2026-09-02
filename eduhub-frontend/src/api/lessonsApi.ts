import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './baseApi'
import type { Lesson } from './type'
import type { PaginatedResponse } from './coursesApi'

export type LessonPayload = Pick<Lesson, 'title' | 'content' | 'order'>

export const lessonKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonKeys.all, 'list'] as const,
  list: (courseId: number) => [...lessonKeys.lists(), courseId] as const,
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (courseId: number, lessonId: number) =>
    [...lessonKeys.details(), courseId, lessonId] as const,
}

const lessonsApi = {
  list: async (courseId: number) =>
    (await api.get<PaginatedResponse<Lesson>>(`/courses/${courseId}/lessons/`)).data,
  detail: async ({ courseId, lessonId }: { courseId: number; lessonId: number }) =>
    (await api.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}/`)).data,
  create: async ({ courseId, payload }: { courseId: number; payload: LessonPayload }) =>
    (await api.post<Lesson>(`/courses/${courseId}/lessons/`, payload)).data,
  update: async ({
    courseId,
    lessonId,
    payload,
  }: {
    courseId: number
    lessonId: number
    payload: Partial<LessonPayload>
  }) => (await api.patch<Lesson>(`/courses/${courseId}/lessons/${lessonId}/`, payload)).data,
  remove: async ({ courseId, lessonId }: { courseId: number; lessonId: number }) => {
    await api.delete(`/courses/${courseId}/lessons/${lessonId}/`)
  },
}

export function useLessonsQuery(courseId: number) {
  return useQuery({ queryKey: lessonKeys.list(courseId), queryFn: () => lessonsApi.list(courseId) })
}

export function useLessonQuery(courseId: number, lessonId: number) {
  return useQuery({
    queryKey: lessonKeys.detail(courseId, lessonId),
    queryFn: () => lessonsApi.detail({ courseId, lessonId }),
  })
}

export function useCreateLessonMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonsApi.create,
    onSuccess: (_, { courseId }) =>
      queryClient.invalidateQueries({ queryKey: lessonKeys.list(courseId) }),
  })
}

export function useUpdateLessonMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonsApi.update,
    onSuccess: (_, { courseId, lessonId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: lessonKeys.list(courseId) }),
        queryClient.invalidateQueries({ queryKey: lessonKeys.detail(courseId, lessonId) }),
      ]),
  })
}

export function useDeleteLessonMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: lessonsApi.remove,
    onSuccess: (_, { courseId }) =>
      queryClient.invalidateQueries({ queryKey: lessonKeys.list(courseId) }),
  })
}
