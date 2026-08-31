import { Link, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import { useDeleteProfileMutation, useProfileQuery } from '../../api/profileApi'
import styles from './ProfilePage.module.css'

const ProfilePage = () => {
  const navigate = useNavigate()
  const profileQuery = useProfileQuery()
  const deleteProfile = useDeleteProfileMutation()

  if (profileQuery.isPending) return <p>Завантажуємо профіль…</p>
  if (profileQuery.isError) return <p>❌ {getApiErrorMessage(profileQuery.error)}</p>

  const profile = profileQuery.data

  const handleDelete = async () => {
    if (!window.confirm('Видалити профіль без можливості відновлення?')) return

    try {
      await deleteProfile.mutateAsync()
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Не вдалося видалити профіль:', error)
    }
  }

  return (
    <section className={styles.profileContainer}>
      <div className={styles.profileLeft}>
        <h2 className={styles.profileText}>Профіль користувача</h2>
        <div className={styles.profileAvatarContainer}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={`Аватар ${profile.first_name}`} className={styles.profileAvatar} />
          ) : (
            <div className={styles.avatarPlaceholder} aria-label="Аватар відсутній">
              <svg className={styles.avatarIcon} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
          )}
        </div>
        <div className={styles.profileButtons}>
          <Link to="/profile/update" className="btn-card">Оновити профіль</Link>
          <button onClick={handleDelete} disabled={deleteProfile.isPending} className="btn-card">
            {deleteProfile.isPending ? 'Видаляємо…' : 'Видалити мій профіль'}
          </button>
        </div>
        {deleteProfile.isError && <p>❌ {getApiErrorMessage(deleteProfile.error)}</p>}
      </div>

      <div className={styles.profileRight}>
        <p><strong>Ім’я:</strong> {profile.first_name}</p>
        <p><strong>Прізвище:</strong> {profile.last_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Роль:</strong> {profile.role}</p>
        <p><strong>Біографія:</strong> {profile.bio || 'Не вказано'}</p>
      </div>
    </section>
  )
}

export default ProfilePage
