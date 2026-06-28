
from django.urls import path
from users.views import UserLogoutView, UserRegisterView, UserLoginView, UserProfileView, UserListView, UserUpdateView, UserDeleteView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name= 'register'),
    path("login/", UserLoginView.as_view(), name= 'login'),
    path("logout/", UserLogoutView.as_view(), name= 'logout'),
    path("profile/", UserProfileView.as_view(), name= 'profile'),
    path("profile/update", UserUpdateView.as_view(), name= 'profile_update'),
    path("users/", UserListView.as_view(), name= 'users_list'),
    path("profile/<int:pk>/delete", UserDeleteView.as_view(), name= 'profile_delete'),
]