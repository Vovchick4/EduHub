
from django.urls import path
from users.views import UserRegisterView, UserLoginView, UserProfileView, UserListView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name= 'register'),
    path("login/", UserLoginView.as_view(), name= 'login'),
    path("profile/", UserProfileView.as_view(), name= 'profile'),
    path("users/", UserListView.as_view(), name= 'list'),
]