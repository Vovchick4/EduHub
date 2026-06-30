from django.db import models
from django.conf import settings  # Додано для правильного зв'язку з User

class Course(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(max_length=500, blank=True, null=True)

    preview = models.ImageField(upload_to='course_previews/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Використовуємо settings.AUTH_USER_MODEL замість жорстко прописаного рядка
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='courses'
    )
    students = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='enrolled_courses',
        blank=True)

    def __str__(self):
        return self.name