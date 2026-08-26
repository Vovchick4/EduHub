import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../api/auth/authSlice';
import { profileApi } from '../api/profileApi';
import { coursesApi } from '../api/coursesApi';
import { lessonsApi } from '../api/lessonsApi';
import { authApi } from '../api/auth/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [lessonsApi.reducerPath]: lessonsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(coursesApi.middleware)
      .concat(lessonsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
