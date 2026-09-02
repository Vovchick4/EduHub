import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import {
  type ProfilePayload,
  useProfileQuery,
  useUpdateProfileMutation,
} from '../../api/profileApi'
import styles from './ProfilePage.module.css'

type ProfileFormValues = Omit<ProfilePayload, 'avatar'> & { avatar: string }

const emptyForm: ProfileFormValues = {
  first_name: '',
  last_name: '',
  bio: '',
  avatar: '',
}

const ProfileChangePage = () => {
  const navigate = useNavigate()
  const profileQuery = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()
  const [form, setForm] = useState<ProfileFormValues>(emptyForm)

  useEffect(() => {
    if (!profileQuery.data) return

    setForm({
      first_name: profileQuery.data.first_name,
      last_name: profileQuery.data.last_name,
      bio: profileQuery.data.bio ?? '',
      avatar: profileQuery.data.avatar ?? '',
    })
  }, [profileQuery.data])

  const updateField = <Key extends keyof ProfileFormValues>(
    key: Key,
    value: ProfileFormValues[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await updateProfile.mutateAsync({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim() || null,
      })
      navigate('/profile')
    } catch (error) {
      console.error('Не вдалося оновити профіль:', error)
    }
  }

  if (profileQuery.isPending) return <p>Завантажуємо профіль…</p>
  if (profileQuery.isError) return <p>❌ {getApiErrorMessage(profileQuery.error)}</p>

  return (
    <section className={styles.profileContainer}>
      <h2>Редагування профілю</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ім’я
          <input
            value={form.first_name}
            onChange={(event) => updateField('first_name', event.target.value)}
            required
          />
        </label>
        <label>
          Прізвище
          <input
            value={form.last_name}
            onChange={(event) => updateField('last_name', event.target.value)}
            required
          />
        </label>
        <label>
          Біографія
          <textarea value={form.bio} onChange={(event) => updateField('bio', event.target.value)} />
        </label>
        <label>
          URL аватара
          <input
            type="url"
            value={form.avatar}
            onChange={(event) => updateField('avatar', event.target.value)}
          />
        </label>
        <div className={styles.profileButtons}>
          <button type="submit" disabled={updateProfile.isPending} className="btn-card">
            {updateProfile.isPending ? 'Зберігаємо…' : 'Зберегти'}
          </button>
          <Link to="/profile" className="btn-card">
            Скасувати
          </Link>
        </div>
        {updateProfile.isError && <p>❌ {getApiErrorMessage(updateProfile.error)}</p>}
      </form>
    </section>
  )
}

export default ProfileChangePage
