from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from django.contrib.auth import get_user_model

Customer = get_user_model()

class CustomerCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=100, required=True)
    last_name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)

    class Meta:
        model = Customer
        fields = ('email', 'first_name', 'last_name', 'password1', 'password2')
        
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 and password2 and password1 != password2:
            self.add_error('password2', "Les mots de passe ne correspondent pas")
        
        return cleaned_data

class CustomerAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label="Email")
  
    
class CustomPasswordChangeForm(PasswordChangeForm):
    class Meta:
        fields = ['old_password', 'new_password1', 'new_password2']