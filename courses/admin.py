from django.contrib import admin
from .models import Course
from lessons.models import Lesson

# Register your models here.
class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1  
    fields = ('order', 'title', 'content')  
    ordering = ('order',)  

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'author', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'author__email') 
    list_filter = ('created_at', 'author')
    
    inlines = [LessonInline]