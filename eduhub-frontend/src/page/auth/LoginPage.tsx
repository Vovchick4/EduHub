// src/pages/LoginPage.tsx
import { useLoginMutation } from '../../api/auth/authApi'
import { useAppDispatch } from "../../store/hooks";
import { setToken } from "../../api/auth/authSlice";
import { useState } from "react";

export default function LoginPage() {
  const [login, { isLoading, isError }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setToken(result.token)); // зберігаємо токен у Redux
    } catch (error) {
      console.error("Помилка входу:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вхід</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        Увійти
      </button>
      {isError && <p>❌ Невірний email або пароль</p>}
    </form>
  );
}
