from rest_framework import permissions
from django.shortcuts import get_object_or_404
from courses.models import Course

class IsCourseAuthorOrAdminOrCreateOnly(permissions.BasePermission):
    """
    Дозволяє створювати уроки в курсі тільки автору цього курсу або адміну.
    """
    def has_permission(self, request, view):
        if request.method == 'POST':
            # Витягуємо course_id з URL-маршруту
            course_id = view.kwargs.get("course_id")
            course = get_object_or_404(Course, id=course_id)
            # Перевіряємо, чи поточний користувач є автором курсу або адміном
            return request.user.is_authenticated and (course.author == request.user or request.user.role == "admin")
        return request.user.is_authenticated


class IsCourseAuthorOrAdminForLesson(permissions.BasePermission):
    """
    Дозволяє редагувать/видалять урок тільки автору курсу, до якого він належить, або адміну.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        # obj — це екземпляр Lesson, тому перевіряємо через obj.course.author
        return obj.course.author == request.user or request.user.role == "admin"
