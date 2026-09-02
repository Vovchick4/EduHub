from django.contrib import messages
from django.urls import reverse
from django.views.generic import CreateView, DeleteView, DetailView, ListView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect, get_object_or_404

from courses.models import Course
from lessons.form import CommentForm, LessonForm
from lessons.models import Comment, Lesson

class LessonListView(ListView):
    model = Lesson
    template_name = "lessons/lessons_list.html"
    context_object_name = 'lessons'
    paginate_by = 10
    

class LessonDetailView(DetailView):
    model = Lesson
    template_name = "lessons/lesson_detail.html"
    context_object_name = "lesson"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["comment_form"] = CommentForm()
        return context


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


class CommentCreateView(LoginRequiredMixin, UserPassesTestMixin, CreateView):
    model = Comment
    form_class = CommentForm

    def get_lesson(self):
        return get_object_or_404(
            Lesson,
            pk=self.kwargs["pk"],
            course_id=self.kwargs["course_id"],
        )

    def test_func(self):
        lesson = self.get_lesson()
        user = self.request.user
        return (
            user == lesson.course.author
            or user.role == "admin"
            or lesson.course.students.filter(pk=user.pk).exists()
        )

    def handle_no_permission(self):
        messages.error(self.request, "Лише учасники курсу можуть залишати коментарі.")
        return redirect("lesson_detail", course_id=self.kwargs["course_id"], pk=self.kwargs["pk"])

    def form_valid(self, form):
        form.instance.lesson = self.get_lesson()
        form.instance.author = self.request.user
        messages.success(self.request, "Коментар додано.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            "lesson_detail",
            kwargs={"course_id": self.kwargs["course_id"], "pk": self.kwargs["pk"]},
        )


class CommentDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Comment

    def get_queryset(self):
        return Comment.objects.filter(
            lesson_id=self.kwargs["lesson_pk"],
            lesson__course_id=self.kwargs["course_id"],
        )

    def test_func(self):
        comment = self.get_object()
        return (
            self.request.user == comment.author
            or self.request.user == comment.lesson.course.author
            or self.request.user.role == "admin"
        )

    def handle_no_permission(self):
        messages.error(self.request, "Ви не можете видалити цей коментар.")
        return redirect(
            "lesson_detail",
            course_id=self.kwargs["course_id"],
            pk=self.kwargs["lesson_pk"],
        )

    def get_success_url(self):
        messages.success(self.request, "Коментар видалено.")
        return reverse(
            "lesson_detail",
            kwargs={"course_id": self.kwargs["course_id"], "pk": self.kwargs["lesson_pk"]},
        )
