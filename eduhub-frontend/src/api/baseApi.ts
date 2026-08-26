import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store/store';
import { setCredentials, logout } from '../api/auth/authSlice'

export const BASE_API = 'http://localhost:8000/';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Якщо токен застарів (401 Unauthorized)
  if (result.error && result.error.status === 401) {
    
    // 👇 Дістаємо refresh токен безпосередньо з твоєї нової структури Redux State!
    const refresh = (api.getState() as RootState).auth.refreshToken;

    if (refresh) {
      const refreshResult = await baseQuery(
        {
          url: '/users/token/refresh/', // Твій шлях без api/
          method: 'POST',
          body: { refresh },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as { access: string; refresh?: string };
        
        // 👇 Викликаємо твій новий екшен setCredentials для збереження токенів
        api.dispatch(setCredentials({ 
          access: data.access, 
          refresh: data.refresh // Передаємо новий refresh, якщо увімкнено ROTATE_REFRESH_TOKENS
        }));

        // Повторюємо початковий запит користувача з новим токеном
        result = await baseQuery(args, api, extraOptions);
      } else {
        // 👇 Якщо оновити не вдалося — викликаємо твій новий екшен logout
        api.dispatch(logout());
      }
    }
  }

  return result;
};
