from rest_framework import permissions

class IsTeacherOrAdminOrCreateOnly(permissions.BasePermission):
    """
    Дозволяє створення курсів тільки користувачам із роллю 'teacher' або 'admin'.
    """
    def has_permission(self, request, view):
        # Якщо це запит на створення (POST)
        if request.method == 'POST':
            return request.user.is_authenticated and request.user.role in ['teacher', 'admin']
        # Для безпечних методів (GET) дозволяємо всім авторизованим
        return request.user.is_authenticated


class IsAuthorOrAdminOrReadOnly(permissions.BasePermission):
    """
    Дозволяє редагувати/видаляти курс тільки його автору або адміну.
    """
    def has_object_permission(self, request, view, obj):
        # Читати (GET) можуть всі авторизовані
        if request.method in permissions.SAFE_METHODS:
            return True
        # Змінювати/видаляти — тільки автор або адмін
        return obj.author == request.user or request.user.role == 'admin'
