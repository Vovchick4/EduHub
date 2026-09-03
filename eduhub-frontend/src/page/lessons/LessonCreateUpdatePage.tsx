import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import {
  useCreateLessonMutation,
  useLessonQuery,
  useUpdateLessonMutation,
} from '../../api/lessonsApi'
import '../courses/CourseCreateUpdate.css'

const LessonCreateUpdatePage = () => {
  const { id, lessonId } = useParams()
  const courseId = Number(id)
  const parsedLessonId = Number(lessonId)
  const editing = Boolean(lessonId)
  const navigate = useNavigate()
  const lessonQuery = useLessonQuery(courseId, parsedLessonId)
  const createMutation = useCreateLessonMutation()
  const updateMutation = useUpdateLessonMutation()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [order, setOrder] = useState(1)
  useEffect(() => {
    if (lessonQuery.data) {
      setTitle(lessonQuery.data.title)
      setContent(lessonQuery.data.content ?? '')
      setOrder(lessonQuery.data.order)
    }
  }, [lessonQuery.data])
  if (!Number.isInteger(courseId) || courseId <= 0) return <p>Некоректний курс.</p>
  if (editing && lessonQuery.isPending) return <p>Завантажуємо урок…</p>
  if (editing && lessonQuery.isError) return <p>❌ {getApiErrorMessage(lessonQuery.error)}</p>
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const payload = { title: title.trim(), content: content.trim(), order }
    if (editing)
      updateMutation.mutate(
        { courseId, lessonId: parsedLessonId, payload },
        { onSuccess: () => navigate(`/courses/${courseId}/lessons/${parsedLessonId}`) },
      )
    else
      createMutation.mutate(
        { courseId, payload },
        { onSuccess: (lesson) => navigate(`/courses/${courseId}/lessons/${lesson.id}`) },
      )
  }
  const error = createMutation.error ?? updateMutation.error
  const pending = createMutation.isPending || updateMutation.isPending
  return (
    <section className="course-form-container">
      <div className="form-card">
      <h2 className="form-title">{editing ? 'Редагувати урок' : 'Додати урок'}</h2>
      <form className="styled-form" onSubmit={submit}>
        <label>
          Назва
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={30} required />
        </label>
        <label>
          Порядок
          <input
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value) || 1)}
            required
          />
        </label>
        <label>
          Матеріал
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            rows={10}
          />
        </label>
        {error && <p>❌ {getApiErrorMessage(error)}</p>}
        <button className="btn-submit" disabled={pending}>
          {pending ? 'Зберігаємо…' : 'Зберегти'}
        </button>
        <Link to={`/courses/${courseId}`} className="btn-card">
          Скасувати
        </Link>
      </form>
      </div>
    </section>
  )
}
export default LessonCreateUpdatePage
