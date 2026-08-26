import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function getErrorMessage(error: unknown): string {
  if (!error) return 'Невідома помилка';

  if ('status' in (error as FetchBaseQueryError)) {
    const err = error as FetchBaseQueryError;
    if (typeof err.data === 'string') {
      return err.data;
    }
    if (typeof err.data === 'object' && err.data !== null) {
      return JSON.stringify(err.data);
    }
    return `Помилка сервера: ${err.status}`;
  }

  if ((error as any).message) {
    return (error as any).message;
  }

  return 'Невідома помилка';
}
