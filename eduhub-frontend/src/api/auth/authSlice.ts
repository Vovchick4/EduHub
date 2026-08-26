import { createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Profile } from '../type';

// 1. Додаємо обидва токени в інтерфейс стану
export interface AuthState {
  user: Profile | null; // підстав свій тип користувача
  token: string | null;        // Це твій access_token
  refreshToken: string | null; // Сюди зберігатимемо refresh_token
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 2. Екшен для збереження даних при логіні або оновленні токенів
    setCredentials: (
      state,
      action: PayloadAction<{ user?: Profile; access: string; refresh?: string }>
    ) => {
      const { user, access, refresh } = action.payload;
      if (user) state.user = user;
      state.token = access; // Django SimpleJWT повертає ключ "access"
      if (refresh) state.refreshToken = refresh; // Django повертає ключ "refresh"
    },
    // 3. Екшен для очищення стану при виході
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
