
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from users.api_views import LoginAPIView, ProfileAPIView, RegisterAPIView
from users.views import UserLogoutView, UserRegisterView, UserLoginView, UserProfileView, UserListView, UserUpdateView, UserDeleteView

urlpatterns = [
    # path("register/", UserRegisterView.as_view(), name= 'register'),
    # path("login/", UserLoginView.as_view(), name= 'login'),
    # path("logout/", UserLogoutView.as_view(), name= 'logout'),
    # path("profile/", UserProfileView.as_view(), name= 'profile'),
    # path("profile/update", UserUpdateView.as_view(), name= 'profile_update'),
    # path("users/", UserListView.as_view(), name= 'users_list'),
    # path("profile/<int:pk>/delete", UserDeleteView.as_view(), name= 'profile_delete'),
    # ###
    path("register/", RegisterAPIView.as_view(), name="api-register"),
    path("login/", LoginAPIView.as_view(), name="api-login"),
    path("profile/", ProfileAPIView.as_view(), name="api-profile"),
    # НОВІ МАРШРУТИ ДЛЯ JWT
    # 1. Ендпоінт для оновлення access токена (фронтенд передає сюди refresh токен)
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    
    # 2. Ендпоінт для Logout (фронтенд передає сюди refresh токен, щоб спалити його в блеклісті)
    path("api/logout/", TokenBlacklistView.as_view(), name="token-blacklist"),
]