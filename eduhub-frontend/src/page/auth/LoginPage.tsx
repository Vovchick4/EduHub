import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useLoginMutation } from '../../api/auth/authApi'
import { getApiErrorMessage } from '../../api/apiError'
import { saveTokens } from '../../api/auth/tokenStorage'
import './AuthPage.css'

export default function LoginPage() {
  const login = useLoginMutation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const result = await login.mutateAsync({ email: email.trim(), password })
      saveTokens({ access: result.access, refresh: result.refresh })
      navigate('/courses')
    } catch { /* error is displayed below */ }
  }

  return <section className="auth-page"><div className="auth-card"><span className="auth-card__badge">EduHub</span><h1>З поверненням!</h1><p className="auth-card__lead">Увійдіть, щоб продовжити навчання.</p><form className="auth-form" onSubmit={handleSubmit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="name@example.com" required /></label><label>Пароль<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Ваш пароль" required /></label>{login.isError && <p className="auth-error">{getApiErrorMessage(login.error)}</p>}<button className="btn-card auth-submit" type="submit" disabled={login.isPending}>{login.isPending ? 'Входимо…' : 'Увійти'}</button></form><p className="auth-switch">Ще немає акаунта? <Link to="/register">Зареєструватися</Link></p></div></section>
}
