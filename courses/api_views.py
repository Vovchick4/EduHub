from django.db.models import Q

from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Course
from .permissions import (
    IsAuthorOrAdminOrReadOnly,
    IsTeacherOrAdminOrCreateOnly,
)
from .serializers import CourseSerializer


class CoursePagination(PageNumberPagination):
    page_size = 9


# 1. Список курсів + створення
class CourseListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    permission_classes = [
        IsAuthenticated,
        IsTeacherOrAdminOrCreateOnly,
    ]

    pagination_class = CoursePagination

    def get_queryset(self):
        queryset = (
            Course.objects
            .select_related("author")
            .order_by("id")
        )

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(description__icontains=search)
            )

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()

        if self.request.user.is_authenticated:
            context["cached_enrolled_ids"] = set(
                self.request.user.enrolled_courses.values_list(
                    "id",
                    flat=True,
                )
            )

        return context

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user
        )


# 2. Деталі + оновлення + видалення
class CourseRetrieveUpdateDestroyAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Course.objects.select_related("author")

    serializer_class = CourseSerializer

    permission_classes = [
        IsAuthenticated,
        IsAuthorOrAdminOrReadOnly,
    ]


# 3. Запис / відписка від курсу
class CourseEnrollToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        course = generics.get_object_or_404(
            Course,
            pk=pk,
        )

        # Викладач не може записатися на власний курс
        if course.author == request.user:
            return Response(
                {
                    "detail": (
                        "Викладач не може записатись "
                        "на власний курс."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Якщо вже записаний → відписуємо
        if course.students.filter(
            pk=request.user.pk
        ).exists():
            course.students.remove(request.user)

            return Response(
                {
                    "detail": (
                        f"Ви відписалися від курсу "
                        f"'{course.name}'."
                    ),
                    "enrolled": False,
                },
                status=status.HTTP_200_OK,
            )

        # Якщо не записаний → записуємо
        course.students.add(request.user)

        return Response(
            {
                "detail": (
                    f"Ви успішно записалися на курс "
                    f"'{course.name}'."
                ),
                "enrolled": True,
            },
            status=status.HTTP_200_OK,
        )