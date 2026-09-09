import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import { useCoursesQuery } from '../../api/coursesApi'
import { useProfileQuery } from '../../api/profileApi'
import './CourseList.css'

const CourseListPage = () => {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Debounce: оновлюємо searchQuery через 400мс після того, як користувач перестав друкувати
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setPage(1) // При новому пошуку скидаємо на 1 сторінку
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput])

  const coursesQuery = useCoursesQuery(page, searchQuery)
  const profileQuery = useProfileQuery()
  const courses = coursesQuery.data?.results ?? []
  const canCreateCourse =
    profileQuery.data?.role === 'teacher' || profileQuery.data?.role === 'admin'

  return (
    <div>
      <section className="course-list-container">
        <h2 className="section-title">Список курсів</h2>

        {/* Панель з пошуком та кнопкою створення */}
        <div className="search-and-actions-bar" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="🔍 Пошук курсів..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #332a59',
              background: '#160d33',
              color: '#fff',
              flexGrow: 1,
            }}
          />

          {canCreateCourse && (
            <Link to="/courses/create" className="btn-card">
              ➕ Додати новий курс
            </Link>
          )}
        </div>

        {coursesQuery.isPending && <p>Завантажуємо курси…</p>}
        {coursesQuery.isError && <p>❌ {getApiErrorMessage(coursesQuery.error)}</p>}

        {!coursesQuery.isPending && !coursesQuery.isError && (
          <div className="course-grid">
            {courses.length > 0 ? (
              courses.map((course) => (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
                  {course.preview ? (
                    <img src={course.preview} alt={course.name} className="course-preview" />
                  ) : (
                    <div className="course-icon">📘</div>
                  )}
                  <div className="course-content">
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>Курсів за вашим запитом не знайдено.</p>
            )}
          </div>
        )}

        {(coursesQuery.data?.previous || coursesQuery.data?.next) && (
          <nav className="pagination-container" aria-label="Пагінація курсів">
            <button
              disabled={!coursesQuery.data?.previous}
              onClick={() => setPage((current) => current - 1)}
            >
              ← Попередня
            </button>
            <span>Сторінка {page}</span>
            <button
              disabled={!coursesQuery.data?.next}
              onClick={() => setPage((current) => current + 1)}
            >
              Наступна →
            </button>
          </nav>
        )}
      </section>
    </div>
  )
}

export default CourseListPage