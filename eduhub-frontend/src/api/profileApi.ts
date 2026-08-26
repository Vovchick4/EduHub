import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseApi';
import type { Profile } from './type';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: customBaseQuery,
  tagTypes: ["Profile"], // 👈 Оголошуємо тег
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => '/users/profile/',
      providesTags: ["Profile"], // 👈 Прив'язуємо тег
    }),
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (profileData) => ({
        url: '/users/profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ["Profile"], // 👈 Спалюємо кеш профілю для його автооновлення
    }),
    deleteProfile: builder.mutation<void, void>({
      query: () => ({
        url: '/users/profile/',
        method: 'DELETE',
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});


export const { 
  useGetProfileQuery, 
  useUpdateProfileMutation, 
  useDeleteProfileMutation 
} = profileApi;
