from django.contrib import messages
from django.urls import reverse
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect, get_object_or_404

from courses.models import Course
from lessons.form import LessonForm
from lessons.models import Lesson

class LessonListView(ListView):
    model = Lesson
    template_name = "lessons/lessons_list.html"
    context_object_name = 'lessons'
    paginate_by = 10
    

class LessonDetailView(DetailView):
    model = Lesson
    template_name = "lessons/lesson_detail.html"
    context_object_name = "lesson"


class LessonCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Lesson
    form_class = LessonForm
    template_name = 'lessons/lesson_form.html'
    
    def test_func(self):
        course_id = self.kwargs.get("course_id")
        course = get_object_or_404(Course, id=course_id)
        return self.request.user == course.author or self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "You don't have permission to add lessons to this course.")
        return redirect('course_list')
    
    def form_valid(self, form):
        course_id = self.kwargs.get("course_id")
        form.instance.course = get_object_or_404(Course, id=course_id)

        messages.success(self.request, f"Lesson '{form.instance.title}' was successfully created!")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("course_detail", kwargs={"pk": self.kwargs.get("course_id")})


class LessonUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Lesson
    form_class = LessonForm
    template_name = "lessons/lesson_form.html"

    def test_func(self):
        lesson = self.get_object()
        return self.request.user == lesson.course.author or self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "You don't have permission to edit this lesson.")
        return redirect('course_list')
    
    def form_valid(self, form):
        messages.success(self.request, f"Lesson '{form.instance.title}' updated successfully.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse("course_detail", kwargs={"pk": self.object.course.id})


class LessonDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Lesson
    template_name = "lessons/lesson_confirm_delete.html"

    def test_func(self):
        lesson = self.get_object()
        return self.request.user == lesson.course.author or self.request.user.role == "admin"

    def handle_no_permission(self):
        messages.error(self.request, "You do not have permission to delete this lesson.")
        return redirect('course_list')
    
    def delete(self, request, *args, **kwargs):
        lesson = self.get_object()
        messages.success(self.request, f"Lesson '{lesson.title}' was successfully deleted.")
        return super().delete(request, *args, **kwargs)

    def get_success_url(self):
        return reverse("course_detail", kwargs={"pk": self.kwargs.get("course_id")})
