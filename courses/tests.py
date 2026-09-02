from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Course

User = get_user_model()

class CourseModelTest(TestCase):
    def setUp(self):
        # Спочатку створюємо автора (викладача)
        self.author = User.objects.create_user(
            email="teacher@example.com",
            password="password123",
            first_name="Олексій",
            last_name="Викладач",
            role="teacher"
        )
        # Створюємо курс з правильним автором та полем name
        self.course = Course.objects.create(
            name="Python Backend",
            description="Вивчи Django та FastAPI",
            author=self.author
        )

    def test_course_creation(self):
        """Перевіряємо, чи правильно створився курс"""
        self.assertEqual(self.course.name, "Python Backend")
        self.assertEqual(str(self.course), "Python Backend")


class CourseViewsTest(TestCase):
    def test_home_page_status_code(self):
        """Перевіряємо, чи відкривається головна сторінка"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)