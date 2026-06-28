from django.contrib import messages
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.shortcuts import redirect 
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, DetailView, ListView, UpdateView, DeleteView

from users.forms import CustomAuthForm, UserForm, UserProfileForm

User = get_user_model()

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
    next_page = reverse_lazy('login')

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, "You have been logged out successfully")
        return super().dispatch(request, *args, **kwargs)
    

class UserUpdateView(LoginRequiredMixin, UpdateView):
    model = User
    form_class = UserProfileForm
    template_name = "users/profile_update.html"
    success_url = reverse_lazy("profile")

    def get_object(self, queryset=None): # Додано queryset за стандартом Django
        return self.request.user

    def form_valid(self, form):
        messages.success(self.request, "Profile updated successfully")
        return super().form_valid(form)


class UserProfileView(LoginRequiredMixin, DetailView):
    model = User
    template_name = 'users/profile.html'
    context_object_name = 'user'

    def get_object(self, queryset=None):
        return self.request.user
    

class UserListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = User
    template_name = 'users/users_list.html'
    context_object_name = 'users'

    def test_func(self):
        return self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "Sorry, you're not an admin.")
        return redirect('profile')

    def get_queryset(self):
        return User.objects.all()
    
class UserDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = User
    template_name = "users/user_confirm_delete.html"
    login_url = '/users/login/' 

    def test_func(self):
        user = self.get_object()
        return self.request.user == user or self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to delete this user.")
        return redirect('profile')
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        messages.success(self.request, f"User '{user.email}' was successfully deleted.")
    
        if self.request.user == user:
            logout(request)
            
        return super().delete(request, *args, **kwargs)

    def get_success_url(self):
        return reverse("register")