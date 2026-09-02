// src/pages/LoginPage.tsx
import { useLoginMutation } from '../../api/auth/authApi'
import { getApiErrorMessage } from '../../api/apiError'
import { saveTokens } from '../../api/auth/tokenStorage'
import { useNavigate } from 'react-router'
import { useState } from 'react'

export default function LoginPage() {
  const login = useLoginMutation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login.mutateAsync({ email, password })
      saveTokens({ access: result.access, refresh: result.refresh })
      navigate('/courses')
    } catch (error) {
      console.error('Помилка входу:', error)
    }
  }

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
      <button type="submit" disabled={login.isPending}>
        Увійти
      </button>
      {login.isError && <p>❌ {getApiErrorMessage(login.error)}</p>}
    </form>
  )
}
