// src/features/auth/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../baseApi";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../type'

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    // Логін користувача
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/login/", // Спрямовуємо на DRF ендпоінт
        method: "POST",
        body: credentials,
      }),
    }),
    
    // Реєстрація користувача
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (newUser) => ({
        url: "/api/register/", // Спрямовуємо на DRF ендпоінт
        method: "POST",
        body: newUser,
      }),
    }),
    
    // Вихід (передаємо об'єкт з refresh токеном для блекліста)
    logout: builder.mutation<void, { refresh: string }>({
      query: (body) => ({
        url: "/api/logout/", // Спрямовуємо на DRF ендпоінт
        method: "POST",
        body: body, // Передаємо { refresh: "ваш_refresh_токен" }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
