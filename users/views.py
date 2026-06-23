from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from users.models import User
from django.urls import reverse_lazy
from django.views.generic import DetailView, CreateView , ListView 
from django.contrib.auth.views import LoginView, LogoutView

from users.forms import CustomAuthForm, UserForm
from django.contrib import messages

class UserRegisterView(CreateView):
    model = User
    form_class = UserForm
    template_name = 'users/register.html'
    success_url = reverse_lazy('login')
    def form_valid(self, form):
        messages.success(self.request, 'Registration successfully completed')
        return super().form_valid(form)

class UserLoginView(LoginView):
    template_name = 'users/login.html'
    authentication_form = CustomAuthForm
    def form_valid(self, form):
        messages.success(self.request, 'Login successfully completed')
        return super().form_valid(form)
    def form_invalid(self, form):
        messages.error(self.request, 'Wrong login or password')
        return super().form_invalid(form)

class UserLogoutView(LogoutView):
    next_page = "login"

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, "You have been logged out successfully")
        return super().dispatch(request, *args, **kwargs)

class UserProfileView(LoginRequiredMixin, DetailView):
    model = User
    template_name = 'users/profile.html'
    context_object_name = 'user'
    def get_object(self):
        return self.request.user
    
class UserListView(ListView):
    model = User
    template_name = 'users/users_list.html'
    context_object_name = 'users'
    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return User.objects.all()
        elif user.role == "teacher":
            return User.objects.filter(role__in=["teacher", "student"])
        elif user.role == "student":
            return User.objects.filter(role="teacher")
        else:
            return User.objects.none()


