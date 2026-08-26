import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { Lesson } from "./type";

export const lessonsApi = createApi({
  reducerPath: "lessonsApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Lessons"],
  endpoints: (builder) => ({
    
    // 1. НОВИЙ (ОБОВ'ЯЗКОВИЙ) ЗАПИТ: Отримання всіх уроків конкретного курсу
    getLessons: builder.query<Lesson[], number>({
      query: (courseId) => `/courses/${courseId}/lessons/`,
      // Цей запит забезпечує як загальний тег списку, так і теги кожного окремого уроку
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Lessons" as const, id })),
              { type: "Lessons", id: "LIST" },
            ]
          : [{ type: "Lessons", id: "LIST" }],
    }),

    // 2. Отримання окремого уроку за його ID
    getLessonById: builder.query<Lesson, { courseId: number; lessonId: number }>({
      query: ({ courseId, lessonId }) => `/courses/${courseId}/lessons/${lessonId}/`,
      providesTags: (result, error, { lessonId }) => [{ type: "Lessons", id: lessonId }],
    }),
    
    // 3. Створення уроку
    createLesson: builder.mutation<Lesson, { courseId: number; lesson: Partial<Lesson> }>({
      query: ({ courseId, lesson }) => ({
        url: `/courses/${courseId}/lessons/`,
        method: "POST",
        body: lesson,
      }),
      // Спалюємо тег списку, щоб RTK Query автоматично зробив фоновий перезапит getLessons
      invalidatesTags: [{ type: "Lessons", id: "LIST" }],
    }),

    // 4. Оновлення уроку
    updateLesson: builder.mutation<Lesson, { courseId: number; lessonId: number; lesson: Partial<Lesson> }>({
      query: ({ courseId, lessonId, lesson }) => ({
        url: `/courses/${courseId}/lessons/${lessonId}/`,
        method: "PATCH",
        body: lesson,
      }),
      // Спалюємо кеш конкретного уроку
      invalidatesTags: (result, error, { lessonId }) => [{ type: "Lessons", id: lessonId }],
    }),
    
    // 5. Видалення уроку
    deleteLesson: builder.mutation<void, { courseId: number; lessonId: number }>({
      query: ({ courseId, lessonId }) => ({
        url: `/courses/${courseId}/lessons/${lessonId}/`,
        method: "DELETE",
      }),
      // Спалюємо і список (бо уроків стало менше), і кеш самого видаленого уроку
      invalidatesTags: (result, error, { lessonId }) => [
        { type: "Lessons", id: "LIST" },
        { type: "Lessons", id: lessonId }
      ],
    }),
  }),
});

export const {
  useGetLessonsQuery, // Експортуємо новий хук для виведення списку уроків на фронтенді
  useGetLessonByIdQuery,
  useUpdateLessonMutation,
  useCreateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi;
