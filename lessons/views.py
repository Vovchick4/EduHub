from django.views.generic import DetailView, ListView
from lessons.models import Lesson


class LessonListView(ListView):
    model = Lesson
    template_name = 'lessons/lessons_list.html'
    context_object_name = 'lessons'
    paginate_by = 8
    
    def get_queryset(self):
        course_id = self.kwargs.get("course_id")
        return Lesson.objects.filter(course_id=course_id)

class LessonDetailView(DetailView):
    model = Lesson
    template_name = 'lessons/lesson_detail.html'
    context_object_name = 'lesson'