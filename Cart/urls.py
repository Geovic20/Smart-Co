from . import views
from django.urls import path, include 

urlpatterns = [
    path('Chariot/', views.Chariot, name='Chariot'),
    path('panier/ajouter/', views.add_to_cart, name='add_to_cart'),
    path('panier/supprimer/<int:item_id>/', views.remove_cart_item, name='remove_cart_item'),
    path('panier/modifier/<int:item_id>/', views.update_cart_quantity, name='update_cart_quantity'),
    path('Guest/', views.Guest, name='Guest'),
    path('get_cart_count/', views.get_cart_count, name='get_cart_count'),
]