from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

User = get_user_model()

class UserForm(UserCreationForm):
    email = forms.EmailField(required=True, error_messages={'required': 'Please enter your email'})
    first_name = forms.CharField(required=True, error_messages={'required': 'Please enter your name'})
    last_name = forms.CharField(required=True, error_messages={'required': 'Please enter your surname'})
    

    class Meta(UserCreationForm.Meta):
        model = User
        fields = [ 'first_name', 'last_name', 'email', 'bio', 'avatar']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("this email is already registered")
        return email
    
class CustomAuthForm(AuthenticationForm):
    username = forms.EmailField(label="Email")


class UserProfileForm(forms.ModelForm):
    email = forms.EmailField(required=True, error_messages={'required': 'Please enter your email'})
    first_name = forms.CharField(required=True, error_messages={'required': 'Please enter your name'})
    last_name = forms.CharField(required=True, error_messages={'required': 'Please enter your surname'})

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'bio', 'avatar']

    def clean_email(self):
        email = self.cleaned_data.get('email')

        if User.objects.filter(email=email).exclude(pk=self.instance.pk).exists():
            raise forms.ValidationError("This email is already registered.")
        return email