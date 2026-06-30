from django.urls import path
from lessons.views import (
    LessonListView, 
    LessonDetailView, 
    LessonCreateView, 
    LessonUpdateView, 
    LessonDeleteView
)

urlpatterns = [
    path("", LessonListView.as_view(), name="lesson_list"),
    path("create/", LessonCreateView.as_view(), name="lesson_create"),
    path("<int:pk>/", LessonDetailView.as_view(), name="lesson_detail"),
    path("<int:pk>/update/", LessonUpdateView.as_view(), name="lesson_update"),
    path("<int:pk>/delete/", LessonDeleteView.as_view(), name="lesson_delete"),
]
