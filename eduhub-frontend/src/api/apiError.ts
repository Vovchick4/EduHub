import axios from 'axios'

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ detail?: string }>(error)) {
    return error.response?.data?.detail ?? 'Не вдалося виконати запит. Спробуйте ще раз.'
  }
  return 'Сталася неочікувана помилка.'
}
