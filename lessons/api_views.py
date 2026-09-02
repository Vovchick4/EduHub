from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from courses.models import Course
from .models import Lesson
from .serializers import LessonSerializer
from .permissions import IsCourseAuthorOrAdminOrCreateOnly, IsCourseAuthorOrAdminForLesson

# Налаштування пагінації по 10 елементів, як у вашому ListView
class LessonPagination(PageNumberPagination):
    page_size = 10


# 1. Список уроків курсу + Створення уроку (Заміна LessonListView та LessonCreateView)
class CourseLessonListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated, IsCourseAuthorOrAdminOrCreateOnly]
    pagination_class = LessonPagination

    def get_queryset(self):
        # Якщо в URL є course_id, фільтруємо уроки конкретного курсу
        course_id = self.kwargs.get("course_id")
        if course_id:
            return Lesson.objects.filter(course_id=course_id).order_by('id')
        # Якщо раптом викликається загальний список без ID (наприклад, для адмінки)
        return Lesson.objects.all().order_by('id')

    def perform_create(self, serializer):
        # Автоматично знаходимо курс за ID з URL та прив'язуємо його до нового уроку
        course_id = self.kwargs.get("course_id")
        course = get_object_or_404(Course, id=course_id)
        serializer.save(course=course)


# 2. Деталі + Оновлення + Видалення окремого уроку (Заміна LessonDetailView, LessonUpdateView, LessonDeleteView)
class LessonRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated, IsCourseAuthorOrAdminForLesson]
    # За замовчуванням DRF шукатиме урок по id, який передається як <int:pk> в URL
