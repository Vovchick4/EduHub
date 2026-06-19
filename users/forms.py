from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import User

class UserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['name', 'surname', 'email', 'role', "bio", 'avatar', 'password1', 'password2']

    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get('name')
        surname = cleaned_data.get('surname')
        email = cleaned_data.get('email')

        if not name :
            raise forms.ValidationError("Please enter your name")
        if not surname:
            raise forms.ValidationError("Please entre your surname")
        if not email:
            raise forms.ValidationError("Please enter your email ")
        return cleaned_data
    
class CustomAuthForm(AuthenticationForm):
    username =forms.EmailField(label="Email")