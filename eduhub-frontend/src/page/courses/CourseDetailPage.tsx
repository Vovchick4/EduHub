import { Link, useNavigate, useParams } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import {
  useCourseQuery,
  useDeleteCourseMutation,
  useEnrollCourseMutation,
} from '../../api/coursesApi'
import { useLessonsQuery } from '../../api/lessonsApi'
import { useProfileQuery } from '../../api/profileApi'
import './CourseDetail.css'

const CourseDetailPage = () => {
  const { id } = useParams()
  const courseId = Number(id)
  const navigate = useNavigate()
  const courseQuery = useCourseQuery(courseId)
  const lessonsQuery = useLessonsQuery(courseId)
  const profileQuery = useProfileQuery()
  const enrollMutation = useEnrollCourseMutation()
  const deleteMutation = useDeleteCourseMutation()
  if (!Number.isInteger(courseId) || courseId <= 0) return <p>Некоректний ідентифікатор курсу.</p>
  if (courseQuery.isPending || lessonsQuery.isPending) return <p>Завантажуємо курс…</p>
  if (courseQuery.isError) return <p>❌ {getApiErrorMessage(courseQuery.error)}</p>
  if (lessonsQuery.isError) return <p>❌ {getApiErrorMessage(lessonsQuery.error)}</p>
  const course = courseQuery.data
  const lessons = lessonsQuery.data?.results ?? []
  const isOwner = profileQuery.data?.role === 'admin' || profileQuery.data?.email === course.author
  const deleteCourse = () => {
    if (!window.confirm(`Видалити курс «${course.name}»?`)) return
    deleteMutation.mutate(courseId, { onSuccess: () => navigate('/courses') })
  }
  return (
    <section className="course-detail-container">
      <Link to="/courses" className="btn-card">
        ← Назад до курсів
      </Link>
      <div className="course-detail-card">
        {course.preview && (
          <img src={course.preview} alt={course.name} className="course-detail-preview" />
        )}
        <div className="course-detail-content">
          <h2>{course.name}</h2>
          <p>{course.description || 'Опис відсутній.'}</p>
          <p className="text-muted">Автор: {course.author}</p>
          <p className="text-muted">Студентів: {course.students_count}</p>
          {isOwner ? (
            <div className="teacher-actions">
              <Link to={`/courses/${courseId}/lessons/create`} className="btn-card">
                ➕ Додати урок
              </Link>
              <Link to={`/courses/${courseId}/update`} className="btn-card">
                ✏️ Редагувати
              </Link>
              <button
                className="btn-card btn-danger"
                onClick={deleteCourse}
                disabled={deleteMutation.isPending}
              >
                🗑️ Видалити
              </button>
            </div>
          ) : (
            <button
              className={`btn-card ${course.is_enrolled ? 'btn-danger' : ''}`}
              onClick={() => enrollMutation.mutate(courseId)}
              disabled={enrollMutation.isPending}
            >
              {course.is_enrolled ? '← Відписатися' : '✅ Записатися'}
            </button>
          )}
          {enrollMutation.isError && <p>❌ {getApiErrorMessage(enrollMutation.error)}</p>}
          {deleteMutation.isError && <p>❌ {getApiErrorMessage(deleteMutation.error)}</p>}
        </div>
      </div>
      <h3>Уроки цього курсу</h3>
      <div className="lesson-grid">
        {lessons.length ? (
          lessons.map((lesson) => (
            <Link
              to={`/courses/${courseId}/lessons/${lesson.id}`}
              className="lesson-card"
              key={lesson.id}
            >
              <div className="lesson-icon">📖</div>
              <div className="lesson-content">
                <h4>
                  {lesson.order}. {lesson.title}
                </h4>
                <p>{lesson.content}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>У цьому курсі ще немає уроків.</p>
        )}
      </div>
    </section>
  )
}
export default CourseDetailPage
