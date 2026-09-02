import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getApiErrorMessage } from '../../api/apiError'
import {
  useCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from '../../api/coursesApi'
import './CourseCreateUpdate.css'

const CourseCreateUpdatePage = () => {
  const { id } = useParams()
  const courseId = Number(id)
  const editing = Boolean(id)
  const navigate = useNavigate()
  const courseQuery = useCourseQuery(courseId)
  const createMutation = useCreateCourseMutation()
  const updateMutation = useUpdateCourseMutation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  useEffect(() => {
    if (courseQuery.data) {
      setName(courseQuery.data.name)
      setDescription(courseQuery.data.description ?? '')
    }
  }, [courseQuery.data])
  if (editing && courseQuery.isPending) return <p>Завантажуємо курс…</p>
  if (editing && courseQuery.isError) return <p>❌ {getApiErrorMessage(courseQuery.error)}</p>
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const payload = { name: name.trim(), description: description.trim() }
    if (editing)
      updateMutation.mutate(
        { id: courseId, payload },
        { onSuccess: () => navigate(`/courses/${courseId}`) },
      )
    else
      createMutation.mutate(
        { ...payload, preview: null },
        { onSuccess: (course) => navigate(`/courses/${course.id}`) },
      )
  }
  const error = createMutation.error ?? updateMutation.error
  const pending = createMutation.isPending || updateMutation.isPending
  return (
    <section className="course-create-update">
      <h2>{editing ? 'Редагувати курс' : 'Створити курс'}</h2>
      <form onSubmit={submit}>
        <label>
          Назва
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} required />
        </label>
        <label>
          Опис
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={7}
          />
        </label>
        {error && <p>❌ {getApiErrorMessage(error)}</p>}
        <button className="btn-card" disabled={pending}>
          {pending ? 'Зберігаємо…' : 'Зберегти'}
        </button>
        <Link to={editing ? `/courses/${courseId}` : '/courses'} className="btn-card">
          Скасувати
        </Link>
      </form>
    </section>
  )
}
export default CourseCreateUpdatePage
