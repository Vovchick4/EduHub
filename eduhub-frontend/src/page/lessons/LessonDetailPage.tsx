import { Link, useNavigate, useParams } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import { useCourseQuery } from '../../api/coursesApi'
import { useDeleteLessonMutation, useLessonQuery } from '../../api/lessonsApi'
import { useProfileQuery } from '../../api/profileApi'
import './LessonDetail.css'

const LessonDetailPage = () => {
  const { id, lessonId } = useParams()
  const courseId = Number(id)
  const parsedLessonId = Number(lessonId)
  const navigate = useNavigate()
  const lessonQuery = useLessonQuery(courseId, parsedLessonId)
  const courseQuery = useCourseQuery(courseId)
  const profileQuery = useProfileQuery()
  const deleteMutation = useDeleteLessonMutation()
  if (!Number.isInteger(courseId) || !Number.isInteger(parsedLessonId)) return <p>Некоректне посилання на урок.</p>
  if (lessonQuery.isPending) return <p>Завантажуємо урок…</p>
  if (lessonQuery.isError) return <p>❌ {getApiErrorMessage(lessonQuery.error)}</p>
  const lesson = lessonQuery.data
  const deleteLesson = () => {
    if (!window.confirm(`Видалити урок «${lesson.title}»?`)) return
    deleteMutation.mutate({ courseId, lessonId: parsedLessonId }, { onSuccess: () => navigate(`/courses/${courseId}`) })
  }
  const canEdit = profileQuery.data?.role === 'admin' || profileQuery.data?.email === courseQuery.data?.author
  return <section className="lesson-detail-container"><Link to={`/courses/${courseId}`} className="btn-card">← Назад до курсу</Link><article className="lesson-card"><h2 className="lesson-title">{lesson.order}. {lesson.title}</h2><p className="lesson-description">{lesson.content || 'Матеріал уроку ще не додано.'}</p><div className="lesson-meta"><ul><li>Створено: {new Date(lesson.created_at).toLocaleString('uk-UA')}</li><li>Оновлено: {new Date(lesson.updated_at).toLocaleString('uk-UA')}</li></ul></div>{canEdit && <div className="lesson-actions"><Link to={`/courses/${courseId}/lessons/${parsedLessonId}/update`} className="btn-card">✏️ Редагувати</Link><button className="btn-card btn-danger" onClick={deleteLesson} disabled={deleteMutation.isPending}>🗑️ Видалити</button></div>}{deleteMutation.isError && <p>❌ {getApiErrorMessage(deleteMutation.error)}</p>}</article></section>
}
export default LessonDetailPage
