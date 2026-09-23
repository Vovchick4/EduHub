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
    # При редагуванні профілю ім'я та прізвище не можуть бути порожніми
    first_name = serializers.CharField(required=False, allow_blank=False)
    last_name = serializers.CharField(required=False, allow_blank=False)

    # Явно вказуємо ImageField:
    # - required=False: завантаження нового аватара не є обов'язковим при кожному оновленні
    # - allow_null=True: дозволяє видалити аватар, передавши null
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "role", "bio", "avatar"]
        # Блокуємо зміну id, email та критичної для безпеки ролі
        read_only_fields = ["id", "email", "role"]

    def to_internal_value(self, data):
        # Якщо avatar передано як рядок (наприклад, старий URL або порожній рядок з форми/JSON),
        # не вважаємо це завантаженням нового файлу і прибираємо з даних перед валідацією ImageField
        if hasattr(data, 'copy'):
            data = data.copy()
        elif isinstance(data, dict):
            data = dict(data)

        if 'avatar' in data:
            avatar_val = data.get('avatar')
            if isinstance(avatar_val, str):
                data.pop('avatar', None)

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        # Якщо передано новий аватар (файл або null), видаляємо старий файл з диска
        new_avatar = validated_data.get('avatar')
        if 'avatar' in validated_data and instance.avatar and instance.avatar != new_avatar:
            instance.avatar.delete(save=False)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
