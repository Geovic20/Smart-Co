from . import views
from django.urls import path

urlpatterns = [
    path('', views.Payments, name='Payments'),
]
    