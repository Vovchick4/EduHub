from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from .models import Course
from .serializers import CourseSerializer
from .permissions import IsTeacherOrAdminOrCreateOnly, IsAuthorOrAdminOrReadOnly

# Налаштування пагінації по 9 елементів, як у вашому ListView
class CoursePagination(PageNumberPagination):
    page_size = 9


# 1. Список курсів + Створення (Заміна CourseListView та CourseCreateView)
class CourseListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrAdminOrCreateOnly]
    pagination_class = CoursePagination

    def get_queryset(self):
        # Оптимальний запит (select_related)
        return Course.objects.select_related('author').order_by('id')

    def get_serializer_context(self):
        # Оптимізація: витягуємо ID курсів користувача ОДИН раз для всього списку курсів
        context = super().get_serializer_context()
        if self.request.user.is_authenticated:
            context['cached_enrolled_ids'] = set(
                self.request.user.enrolled_courses.values_list('id', flat=True)
            )
        return context

    def perform_create(self, serializer):
        # Автоматично підставляємо автора курсу з JWT токена
        serializer.save(author=self.request.user)


# 2. Деталі + Оновлення + Видалення (Заміна CourseDetailView, CourseUpdateView, CourseDeleteView)
class CourseRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrAdminOrReadOnly]

    # Примітка: Логіку уроків (Lessons), яка була у вашому CourseDetailView, 
    # за стандартами REST краще винести в окремий ендпоінт: /api/courses/{id}/lessons/


# 3. Запис / Відписка від курсу (Заміна CourseEnrollToggleView)
class CourseEnrollToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        course = generics.get_object_or_404(Course, pk=pk)

        # Перевірка: викладач не може записатися на свій курс
        if course.author == request.user:
            return Response(
                {"detail": "Викладач не може записатись на власний курс."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Логіка Toggle (Запис/Відписка)
        if course.students.filter(pk=request.user.pk).exists():
            course.students.remove(request.user)
            return Response(
                {"detail": f"Ви відписалися від курсу '{course.name}'.", "enrolled": False},
                status=status.HTTP_200_OK
            )
        else:
            course.students.add(request.user)
            return Response(
                {"detail": f"Ви успішно записалися на курс '{course.name}'.", "enrolled": True},
                status=status.HTTP_200_OK
            )
