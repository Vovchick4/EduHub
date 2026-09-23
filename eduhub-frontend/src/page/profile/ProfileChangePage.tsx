import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import { useProfileQuery, useUpdateProfileMutation } from '../../api/profileApi'
import styles from './ProfilePage.module.css'

const ProfileChangePage = () => {
  const navigate = useNavigate()
  const profileQuery = useProfileQuery()
  const updateProfile = useUpdateProfileMutation()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    if (!profileQuery.data) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFirstName(profileQuery.data.first_name ?? '')
    setLastName(profileQuery.data.last_name ?? '')
    setBio(profileQuery.data.bio ?? '')
  }, [profileQuery.data])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await updateProfile.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        bio: bio.trim(),
        avatar: avatarFile,
      })
      navigate('/profile')
    } catch (error) {
      console.error('Не вдалося оновити профіль:', error)
    }
  }

  if (profileQuery.isPending) return <p>Завантажуємо профіль…</p>
  if (profileQuery.isError) return <p>❌ {getApiErrorMessage(profileQuery.error)}</p>

  return (
    <section className={`${styles.profileContainer} ${styles.profileEditCard}`}>
      <h2>Редагування профілю</h2>
      <p className={styles.profileEditLead}>Оновіть інформацію, яку бачитимуть учасники EduHub.</p>
      
      <form className={styles.profileForm} onSubmit={handleSubmit}>
        <label>
          Ім’я
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </label>
        
        <label>
          Прізвище
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </label>
        
        <label>
          Біографія
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
          />
        </label>

        <label>
          Аватар
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              if (event.target.files && event.target.files[0]) {
                setAvatarFile(event.target.files[0])
              }
            }}
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