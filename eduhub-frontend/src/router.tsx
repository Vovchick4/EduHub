import { createBrowserRouter } from "react-router";
import Layout from "./components/layout/Layout";
import HomePage from "./page/home/HomePage";
import LoginPage from "./page/auth/LoginPage";
import RegistrationPage from "./page/auth/RegistrationPage";
import ProfilePage from "./page/profile/ProfilePage";
import CourseListPage from "./page/courses/CourseListPage";
import CourseDetailPage from "./page/courses/CourseDetailPage";
import CourseUpdatePage from "./page/courses/CourseUpdatePage";
import CourseCreatePage from "./page/courses/CourseCreatePage";
import LessonCreatePage from "./page/lessons/LessonCreatePage";
import LessonDetailPage from "./page/lessons/LessonDetailPage";
import LessonUpdatePage from "./page/lessons/LessonUpdatePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h1>404</h1>,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegistrationPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/update", element: <ProfilePage /> },
      { path: "/courses", element: <CourseListPage /> },
      { path: "/courses/:id", element: <CourseDetailPage /> },
      { path: "/courses/:id/update", element: <CourseUpdatePage /> },
      { path: "/courses/create", element: <CourseCreatePage /> },
      { path: "/courses/:id/lessons/create", element: <LessonCreatePage /> },
      { path: "/courses/:id/lessons/detail", element: <LessonDetailPage /> },
      { path: "/courses/:id/lessons/update", element: <LessonUpdatePage /> },
    ],
  },
]);
