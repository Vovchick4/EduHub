from rest_framework import serializers
from .models import Lesson

class LessonSerializer(serializers.ModelSerializer):
    # Робимо так, щоб ID курсу повертався, але фронтенд не міг передати його в тілі (body) запиту
    course = serializers.PrimaryKeyRelatedField(read_only=True)
    
    # Дати створюються сервером автоматично, тому вони теж тільки для читання
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'course', 'order', 'title', 'content', 'created_at', 'updated_at']
