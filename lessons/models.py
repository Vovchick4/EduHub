from django.db import models

class Lesson(models.Model):
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='lessons')
    order = models.PositiveIntegerField(default=1)
    title = models.CharField(max_length=30, blank=False, null=False)
    content = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def Meta(self):
        ordering = ['order']
    def __str__(self):
        return f"{self.course.title} - {self.title}"