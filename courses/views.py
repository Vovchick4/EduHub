from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, DetailView, UpdateView, DeleteView
from django.views.generic.list import MultipleObjectMixin
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from courses.form import CourseForm
from courses.models import Course
from django.shortcuts import redirect

class CourseListView(ListView):
    model = Course
    template_name = 'courses/course_list.html'
    context_object_name = 'courses'
    paginate_by = 8

class CourseDetailView(DetailView, MultipleObjectMixin):
    model = Course
    template_name = 'courses/course_detail.html'
    context_object_name = 'course'
    paginate_by = 8

    def get_context_data(self, **kwargs):
        lessons_queryset = self.object.lessons.all().order_by('id')
        context = super().get_context_data(object_list=lessons_queryset, **kwargs)
        return context

class CourseCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Course
    form_class = CourseForm
    template_name = "courses/course_form.html"
    success_url = reverse_lazy("course_list")

    def test_func(self):
        return self.request.user.role in ['teacher', 'admin']

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to create courses.")
        return redirect('course_list')

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, f"Course '{form.instance.name}' was successfully created!")
        return super().form_valid(form)

class CourseUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Course
    form_class = CourseForm
    template_name = "courses/course_form.html"
    success_url = reverse_lazy("course_list")

    def test_func(self):
        course = self.get_object()
        return self.request.user == course.author or self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to edit this course.")
        return super().handle_no_permission()

    def form_valid(self, form):
        messages.success(self.request, f"Course '{form.instance.name}' was successfully updated!")
        return super().form_valid(form)


class CourseDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Course
    template_name = "courses/course_confirm_delete.html"
    success_url = reverse_lazy("course_list")

    def test_func(self):
        course = self.get_object()
        return self.request.user == course.author or self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to delete this course.")
        return redirect('course_list')

    def delete(self, request, *args, **kwargs):
        course = self.get_object()
        messages.success(self.request, f"Course '{course.name}' was successfully deleted.")
        return super().delete(request, *args, **kwargs)