from django.urls import include, path
from courses.api_views import CourseEnrollToggleAPIView, CourseListCreateAPIView, CourseRetrieveUpdateDestroyAPIView
from courses.views import (
    CourseEnrollToggleView,
    CourseListView, 
    CourseDetailView, 
    CourseCreateView, 
    CourseUpdateView, 
    CourseDeleteView
)

urlpatterns = [
    # path("", CourseListView.as_view(), name="course_list"),
    # path("<int:pk>/", CourseDetailView.as_view(), name="course_detail"),
    # path("create/", CourseCreateView.as_view(), name="course_create"),
    # path("<int:pk>/update/", CourseUpdateView.as_view(), name="course_update"),
    # path("<int:pk>/delete/", CourseDeleteView.as_view(), name="course_delete"),
    # path("<int:pk>/enroll-toggle/", CourseEnrollToggleView.as_view(), name="course_enroll_toggle"),


    # GET - отримати список курсів (з пагінацією), POST - створити новий курс
    path("courses/", CourseListCreateAPIView.as_view(), name="course-list-create"),
    
    # GET - деталі курсу, PUT/PATCH - редагування, DELETE - видалення
    path("courses/<int:pk>/", CourseRetrieveUpdateDestroyAPIView.as_view(), name="course-detail-update-delete"),
    
    # POST - записатися або відписатися від курсу
    path("api/courses/<int:pk>/enroll/", CourseEnrollToggleAPIView.as_view(), name="course-enroll-toggle"),

    path("<int:course_id>/lessons/", include("lessons.urls"))
]
