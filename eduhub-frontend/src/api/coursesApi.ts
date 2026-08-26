import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./baseApi";
import type { CourseDetail, CourseList } from "./type";

// Описуємо інтерфейс відповіді від Django з пагінацією
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const coursesApi = createApi({
  reducerPath: "coursesApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Courses"], // 👈 1. Оголошуємо тип тегу
  endpoints: (builder) => ({
    getCourses: builder.query<PaginatedResponse<CourseList>, number | void>({
      query: (page = 1) => `/courses/?page=${page}`,
      providesTags: ["Courses"], // 👈 2. Цей запит кешується під цим тегом
    }),
    getCourseById: builder.query<CourseDetail, number>({
      query: (id) => `/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: "Courses", id }], // Кешуємо конкретний курс по його ID
    }),
    createCourse: builder.mutation<CourseDetail, Partial<CourseDetail>>({
      query: (course) => ({
        url: `/courses/`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Courses"], // 👈 3. Спалюємо кеш списку при створенні
    }),
    updateCourse: builder.mutation<CourseDetail, { id: number; data: Partial<CourseDetail> }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Courses", { type: "Courses", id }], // Оновлюємо і список, і сам детальний курс
    }),
    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/courses/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"], // Спалюємо кеш при видаленні
    }),
    enrollCourse: builder.mutation<{ detail: string; enrolled: boolean }, number>({
      query: (id) => ({
        url: `/courses/${id}/enroll/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => ["Courses", { type: "Courses", id }], // Перезавантажуємо дані курсу, щоб змінився статус підписки
    }),
  }),
});


export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollCourseMutation, // Експортуємо новий хук
} = coursesApi;
