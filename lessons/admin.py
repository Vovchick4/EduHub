from django.contrib import admin
from .models import Comment, Lesson

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'created_at')
    search_fields = ('title', 'content', 'course__name')
    list_filter = ('course', 'created_at')
    ordering = ('course', 'order')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'lesson', 'created_at')
    search_fields = ('author__email', 'content', 'lesson__title')
    list_filter = ('created_at',)
