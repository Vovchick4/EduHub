from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView, ListView, DetailView, UpdateView, DeleteView, View
from django.views.generic.list import MultipleObjectMixin
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from courses.form import CourseForm
from courses.models import Course
from django.shortcuts import get_object_or_404, redirect

class CourseListView(ListView):
    model = Course
    template_name = 'courses/course_list.html'
    context_object_name = 'courses'
    paginate_by = 8

    def get_queryset(self):
            return Course.objects.select_related('author').order_by('id')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            context['enrolled_course_ids'] = self.request.user.enrolled_courses.values_list('id', flat=True)
        else:
            context['enrolled_course_ids'] = []
        return context

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
        return redirect('course_list')
    
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

class CourseEnrollToggleView(LoginRequiredMixin, View):
    def post(self, request, pk):
        course = get_object_or_404(Course.objects.select_related('author'), pk=pk)
        
        if course.author == request.user:
            messages.error(request, "Викладач не може записатись на власний курс.")
            return redirect("course_list")
        
        if course.students.filter(pk=request.user.pk).exists():
            course.students.remove(request.user)
            messages.success(request, f"Ви відписалися від курсу '{course.name}'.")
        else:
            course.students.add(request.user)
            messages.success(request, f"Ви успішно записалися на курс '{course.name}'.")
            
        return redirect("course_list")

        