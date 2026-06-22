from django.contrib import admin
from .models import Lesson

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    search_fields = ('title', 'content', 'course__name')
    list_filter = ('course', 'created_at')
    ordering = ('course', 'order')
