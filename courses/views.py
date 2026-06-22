from django.views.generic import ListView
from django.core.paginator import Paginator
from courses.models import Course

class CourseListView(ListView):
    model = Course
    template_name = 'courses/course_list.html'
    context_object_name = 'courses'
    paginate_by = 6
    