from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    USER_ROLES = (
        ('student', 'student'),
        ('teacher', 'teacher'),
        ('admin', 'admin')
    )
    name = models.CharField(max_length=30, blank=False, null=False)
    surname = models.CharField(max_length=30, blank=False, null=False)
    bio = models.TextField(max_length=500, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=False, null=False, unique=True)
    role = models.CharField(max_length=30, choices=USER_ROLES, default='student')
    avatar= models.ImageField(upload_to="avatars/", blank=True, null=True)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return f'{self.name} {self.surname}'