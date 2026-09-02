from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    # Повертає текстове представлення автора (__str__ моделі User, тобто email)
    author = serializers.StringRelatedField(read_only=True)
    
    # Кількість студентів на курсі (корисно для фронтенду)
    students_count = serializers.IntegerField(source='students.count', read_only=True)
    
    # Наш динамічний прапорець підписки
    is_enrolled = serializers.SerializerMethodField()
    
    # Автоматичні дати тільки для читання
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id', 
            'name', 
            'description', 
            'preview', 
            'author', 
            'students_count', 
            'is_enrolled', 
            'created_at', 
            'updated_at'
        ]

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Оптимізація для списку через кешовані ID
            if 'cached_enrolled_ids' in self.context:
                return obj.id in self.context['cached_enrolled_ids']
            # Звичайна перевірка для Detail View
            return obj.students.filter(pk=request.user.pk).exists()
        return False
