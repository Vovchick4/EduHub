from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=30, blank=False, null=False)
    description = models.TextField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='courses')
    students = models.ManyToManyField('users.User', related_name='enrolled_courses')

    def __str__(self):
        return self.name