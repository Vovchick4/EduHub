import { RouterProvider } from 'react-router/dom'
import './App.css'
import { router } from './router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
