from Users.forms import CustomPasswordChangeForm
from . import views
from django.urls import path, reverse_lazy 
from django.contrib.auth import views as auth_views
from .views import CustomPasswordChangeView

urlpatterns = [
    path('auth/', views.login_signup_combined_view, name='login_signup'),
    path('logout/', views.logout_view, name='logout'),
    path('', views.home_view, name='index'),  
    path('profile/', views.profile_view, name='profile'),
    path('changer-mot-de-passe/', auth_views.PasswordChangeView.as_view(
        template_name='password_change.html',
        form_class=CustomPasswordChangeForm,
        success_url=reverse_lazy('profile')
    ), name='password_change'),
    path('edit_profile/', views.edit_profile_view, name="edit_profile"),
    path('changer-mot-de-passe/', CustomPasswordChangeView.as_view(), name='password_change'),
]

urlpatterns += [
    path('reset-password/', auth_views.PasswordResetView.as_view(
        template_name='password_reset.html',
        email_template_name='password_reset_email.html',
        subject_template_name='password_reset_subject.txt',
        success_url=reverse_lazy('password_reset_done')
    ), name='password_reset'),

    path('reset-password-sent/', auth_views.PasswordResetDoneView.as_view(
        template_name='password_reset_sent.html'
    ), name='password_reset_done'),

    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='password_reset_confirm.html',
        success_url='reset-password-complete/'
    ), name='password_reset_confirm'),

    path('reset-password-complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='password_reset_complete.html'
    ), name='password_reset_complete'),
]