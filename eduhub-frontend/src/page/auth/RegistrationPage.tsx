import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useRegisterMutation } from '../../api/auth/authApi'
import { getApiErrorMessage } from '../../api/apiError'
import './AuthPage.css'

const RegistrationPage = () => {
  const register = useRegisterMutation()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [validationError, setValidationError] = useState('')
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (password !== confirmation) {
      setValidationError('Паролі не збігаються.')
      return
    }
    setValidationError('')
    try {
      await register.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
      })
      navigate('/login', { state: { registered: true } })
    } catch {
      /* error is displayed below */
    }
  }
  const error = validationError || (register.isError ? getApiErrorMessage(register.error) : '')
  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="auth-card__badge">EduHub</span>
        <h1>Створіть акаунт</h1>
        <p className="auth-card__lead">Долучайтеся до навчальної спільноти вже сьогодні.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__row">
            <label>
              Ім’я
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                maxLength={30}
                required
              />
            </label>
            <label>
              Прізвище
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                maxLength={30}
                required
              />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              placeholder="Не менше 8 символів"
              required
            />
          </label>
          <label>
            Підтвердіть пароль
            <input
              type="password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          <button className="btn-card auth-submit" type="submit" disabled={register.isPending}>
            {register.isPending ? 'Створюємо акаунт…' : 'Зареєструватися'}
          </button>
        </form>
        <p className="auth-switch">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </section>
  )
}

export default RegistrationPage
