from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

# Імпортуємо серіалізатори
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework import serializers

# Динамічне отримання моделі користувача
User = get_user_model()


# Допоміжний серіалізатор для логіну (забезпечує валідацію полів)
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)


# Реєстрація
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Логін
class LoginAPIView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer  # Додано для генерації документації (Swagger/Redoc) та валідації

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # Перевіряємо, чи передані всі обов'язкові поля. Якщо ні — повернеться 400 Bad Request
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data.get("email")
        password = serializer.validated_data.get("password")
        
        user = authenticate(request, username=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserProfileSerializer(user, context={'request': request}).data
            }, status=status.HTTP_200_OK)
            
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# Профіль (Перегляд та Оновлення)
class ProfileAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Метод повертає саме того користувача, який зараз авторизований по JWT токену
        return self.request.user
