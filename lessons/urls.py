from django.urls import path
from lessons.api_views import CourseLessonListCreateAPIView, LessonRetrieveUpdateDestroyAPIView
from lessons.views import (
    LessonListView, 
    LessonDetailView, 
    LessonCreateView, 
    LessonUpdateView, 
    LessonDeleteView
)

urlpatterns = [
    # path("", LessonListView.as_view(), name="lesson_list"),
    # path("create/", LessonCreateView.as_view(), name="lesson_create"),
    # path("<int:pk>/", LessonDetailView.as_view(), name="lesson_detail"),
    # path("<int:pk>/update/", LessonUpdateView.as_view(), name="lesson_update"),
    # path("<int:pk>/delete/", LessonDeleteView.as_view(), name="lesson_delete"),

    # GET - отримати список уроків курсу, POST - створити урок у цьому курсі
    # URL на практиці: /api/courses/<course_id>/lessons/
    path("", CourseLessonListCreateAPIView.as_view(), name="lesson-list-create"),
    
    # GET - деталі уроку, PUT/PATCH - редагувати урок, DELETE - видалити урок
    # URL на практиці: /api/courses/<course_id>/lessons/<int:pk>/
    path("<int:pk>/", LessonRetrieveUpdateDestroyAPIView.as_view(), name="lesson-detail-update-destroy"),
]
