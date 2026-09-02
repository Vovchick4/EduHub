import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'
import Layout from "./components/layout/Layout";
import { RequireAuth } from './auth/RequireAuth'
import HomePage from './page/home/HomePage'
const LoginPage = lazy(() => import('./page/auth/LoginPage'))
const RegistrationPage = lazy(() => import('./page/auth/RegistrationPage'))
const ProfilePage = lazy(() => import('./page/profile/ProfilePage'))
const ProfileChangePage = lazy(() => import('./page/profile/ProfileChangePage'))
const CourseListPage = lazy(() => import('./page/courses/CourseListPage'))
const CourseDetailPage = lazy(() => import('./page/courses/CourseDetailPage'))
const CourseUpdatePage = lazy(() => import('./page/courses/CourseCreateUpdatePage'))
const CourseCreatePage = lazy(() => import('./page/courses/CourseCreateUpdatePage'))
const LessonDetailPage = lazy(() => import('./page/lessons/LessonDetailPage'))
const LessonUpdatePage = lazy(() => import('./page/lessons/LessonCreateUpdatePage'))
const LessonCreatePage = lazy(() => import('./page/lessons/LessonCreateUpdatePage'))

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h1>404</h1>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegistrationPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "profile/update", element: <ProfileChangePage /> },
          { path: "courses", element: <CourseListPage /> },
          { path: "courses/:id", element: <CourseDetailPage /> },
          { path: "courses/:id/update", element: <CourseUpdatePage /> },
          { path: "courses/create", element: <CourseCreatePage /> },
          { path: "courses/:id/lessons/create", element: <LessonCreatePage /> },
          { path: "courses/:id/lessons/:lessonId", element: <LessonDetailPage /> },
          { path: "courses/:id/lessons/:lessonId/update", element: <LessonUpdatePage /> },
        ],
      },
    ],
  },
]);
