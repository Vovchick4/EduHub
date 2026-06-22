from django.urls import path
from lessons.views import LessonDetailView, LessonListView

urlpatterns = [
    path('<int:pk>/lessons', LessonListView.as_view(), name = 'lesson_list'),
    path('<int:pk>', LessonDetailView.as_view(), name='lesson_detail')
]