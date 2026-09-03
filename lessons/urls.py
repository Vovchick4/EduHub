from django.urls import path
from lessons.api_views import CourseLessonListCreateAPIView, LessonRetrieveUpdateDestroyAPIView
from lessons.views import (
    LessonListView, 
    LessonDetailView, 
    LessonCreateView, 
    LessonUpdateView, 
    LessonDeleteView,
    CommentCreateView,
    CommentDeleteView,
)

urlpatterns = [
    # path("", LessonListView.as_view(), name="lesson_list"),
    # path("create/", LessonCreateView.as_view(), name="lesson_create"),
    # path("<int:pk>/", LessonDetailView.as_view(), name="lesson_detail"),
    # path("<int:pk>/update/", LessonUpdateView.as_view(), name="lesson_update"),
    # path("<int:pk>/delete/", LessonDeleteView.as_view(), name="lesson_delete"),
    path("<int:pk>/comments/create/", CommentCreateView.as_view(), name="comment_create"),
    path(
        "<int:lesson_pk>/comments/<int:pk>/delete/",
        CommentDeleteView.as_view(),
        name="comment_delete",
    ),

    path("", CourseLessonListCreateAPIView.as_view(), name="lesson-list-create"),
    path("<int:pk>/", LessonRetrieveUpdateDestroyAPIView.as_view(), name="lesson-detail-update-destroy"),
]
