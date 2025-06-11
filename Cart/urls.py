from . import views
from django.urls import path, include 

urlpatterns = [
    path('Chariot/', views.Chariot, name='Chariot'),
    path('panier/ajouter/', views.add_to_cart, name='add_to_cart'),
    path('Guest/', views.Guest, name='Guest'),
]