from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from .forms import CustomerCreationForm, CustomerAuthenticationForm
from django.contrib.auth.views import PasswordChangeView
from django.contrib import messages

def home_view(request):
    return render(request, 'index.html')

#Page d'authentification et d'inscription combinée
# Cette vue gère à la fois l'authentification et l'inscription des utilisateurs.
def login_signup_combined_view(request): 
    login_form = CustomerAuthenticationForm()
    signup_form = CustomerCreationForm()
    
    if request.method == 'POST':
        if 'login' in request.POST:
            login_form = CustomerAuthenticationForm(request, data=request.POST)
            if login_form.is_valid():
                email = login_form.cleaned_data.get('username')
                password = login_form.cleaned_data.get('password')
                user = authenticate(request, email=email, password=password)
                if user is not None:
                    login(request, user)
                    return redirect('index')
        elif 'signup' in request.POST:
            signup_form = CustomerCreationForm(request.POST)
            if signup_form.is_valid():
                user = signup_form.save()
                login(request, user)
                return redirect('index')
    return render(request, 'login_signup.html', {
        'login_form': login_form,
        'signup_form': signup_form
    })

# Page de déconnexion
# Cette vue gère la déconnexion de l'utilisateur.
def logout_view(request):
    logout(request)
    return redirect('index')
  
# Page de profil
# Cette vue affiche le profil de l'utilisateur connecté. 
@login_required
def profile_view(request):
    return render(request, 'profile.html')

# Page de modification du profil
# Cette vue permet à l'utilisateur de modifier son profil.
@login_required
def edit_profile_view(request):
    return render (request, 'edit_profile.html')

# Page de changement de mot de passe
# Cette vue permet à l'utilisateur de changer son mot de passe.
class CustomPasswordChangeView(PasswordChangeView):
    template_name = 'password_change.html'
    success_url = reverse_lazy('profile')

    def form_valid(self, form):
        messages.success(self.request, "✔️ Mot de passe changé avec succès.")
        return super().form_valid(form)