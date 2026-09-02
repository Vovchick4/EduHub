
export interface LoginRequest {
  email: string;
  password: string;
}

// Те, що реально повертає Django LoginAPIView
export interface LoginResponse {
  access: string;  // access_token
  refresh: string; // refresh_token
  user: Profile;   // Дані користувача
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  role: 'student' | 'teacher' | 'admin'; // Робимо тип ролей суворішим
  avatar: string | null; // Повне URL-посилання на картинку
}

// Об'єкт курсу у списку (GET /courses/)
export interface CourseList {
  id: number;
  name: string;
  description: string;
  preview: string | null; // Повне URL-посилання на картинку
  author: string; // Повертає Email автора завдяки StringRelatedField
  students_count: number; // Повертає кількість студентів на курсі
  is_enrolled: boolean; // true/false для поточного авторизованого юзера
  created_at: string;
  updated_at: string;
}


export type CourseDetail = CourseList

// Об'єкт уроку (GET /courses/{course_id}/lessons/)
export interface Lesson {
  id: number;
  course: number; // ID курсу (ForeignKey), Django повертає саме "course"
  title: string;
  content: string;
  order: number;
  created_at: string;
  updated_at: string;
}
