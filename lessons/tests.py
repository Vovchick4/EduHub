from django.test import TestCase
from django.contrib.auth import get_user_model
from courses.models import Course
from .models import Lesson

User = get_user_model()

class LessonModelTest(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            email="author@example.com",
            password="password123",
            first_name="Іван",
            last_name="Франко"
        )
        self.course = Course.objects.create(
            name="Frontend Development",
            author=self.author
        )
        self.lesson = Lesson.objects.create(
            course=self.course,
            title="Основи HTML & CSS",
            order=1
        )

    def test_lesson_has_course(self):
        """Перевіряємо прив'язку уроку до курсу"""
        self.assertEqual(self.lesson.course.name, "Frontend Development")
        self.assertEqual(str(self.lesson), "Frontend Development - Основи HTML & CSS")
