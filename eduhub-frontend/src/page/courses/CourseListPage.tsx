import { useState } from 'react'
import { Link } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import { useCoursesQuery } from '../../api/coursesApi'
import { useProfileQuery } from '../../api/profileApi'
import "./CourseList.css"

const CourseListPage = () => {
  const [page, setPage] = useState(1)
  const coursesQuery = useCoursesQuery(page)
  const profileQuery = useProfileQuery()
  const courses = coursesQuery.data?.results ?? []
  const canCreateCourse = profileQuery.data?.role === 'teacher' || profileQuery.data?.role === 'admin'

  if (coursesQuery.isPending) return <p>Завантажуємо курси…</p>
  if (coursesQuery.isError) return <p>❌ {getApiErrorMessage(coursesQuery.error)}</p>

  return (
    <div>
      <section className="course-list-container">
        <h2 className="section-title">Список курсів</h2>
        {canCreateCourse ? (
          <div className="actions-bar">
            <Link to="/courses/create" className="btn-card">
              ➕ Додати новий курс
            </Link>
          </div>
        ) : (
          ""
        )}

        <div className="course-grid">
          {courses.length > 0 ? (
            <>
              {courses.map((course) => (
                <Link
                  to={`/courses/${course.id}`}
                  key={course.id}
                  className="course-card" >
                  {course.preview ? 
                    <img
                      src={course.preview}
                      alt={course.name}
                      className="course-preview"
                    />
                   : 
                    <div className="course-icon">📘</div>
                  }
                  <div className="course-content">
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <p>Немає доступних курсів.</p>
          )}
        </div>

        {(coursesQuery.data?.previous || coursesQuery.data?.next) && (
          <nav className="pagination-container" aria-label="Пагінація курсів">
            <button disabled={!coursesQuery.data?.previous} onClick={() => setPage((current) => current - 1)}>
              ← Попередня
            </button>
            <span>Сторінка {page}</span>
            <button disabled={!coursesQuery.data?.next} onClick={() => setPage((current) => current + 1)}>
              Наступна →
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}

export default CourseListPage;
