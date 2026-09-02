from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # Пароль приймається тільки на запис і маскується у веб-інтерфейсі
    password = serializers.CharField(
        write_only=True, 
        style={'input_type': 'password'}
    )
    # Явно вказуємо, що ці поля обов'язкові, щоб DRF валідував їх до запиту в БД
    first_name = serializers.CharField(required=True, allow_blank=False)
    last_name = serializers.CharField(required=True, allow_blank=False)

    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name", "role", "bio", "avatar"]

    def create(self, validated_data):
        # Витягуємо обов'язкові поля для create_user
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        
        # extra_fields міститиме first_name, last_name, role, bio, avatar
        return User.objects.create_user(email=email, password=password, **validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    # При редагуванні профілю ім'я та прізвище не можуть бути порожніми (через null=False у моделі)
    first_name = serializers.CharField(required=False, allow_blank=False)
    last_name = serializers.CharField(required=False, allow_blank=False)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "role", "bio", "avatar"]
        # Блокуємо зміну id, email та критичної для безпеки ролі
        read_only_fields = ["id", "email", "role"]

    def update(self, instance, validated_data):
        # Безпечно оновлюємо тільки дозволені поля користувача
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
