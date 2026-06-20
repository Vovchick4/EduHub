
from django.urls import path
from users.views import UserLogoutView, UserRegisterView, UserLoginView, UserProfileView, UserListView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name= 'register'),
    path("login/", UserLoginView.as_view(), name= 'login'),
    path("logout/", UserLogoutView.as_view(), name= 'logout'),
    path("profile/", UserProfileView.as_view(), name= 'profile'),
    path("list_users/", UserListView.as_view(), name= 'users_list'),
]