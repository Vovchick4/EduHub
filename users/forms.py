from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class UserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['name', 'surname', 'email', 'password', 'role', "bio", 'avatar', 'password1', 'password2']

    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get('name')
        email = cleaned_data.get('email')

        if not name :
            raise forms.ValidationError("Please enter your name or nickname.")
        if not email:
            raise forms.ValidationError("Please enter your email ")
        return cleaned_data