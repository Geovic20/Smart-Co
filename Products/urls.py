from . import views
from django.urls import path

urlpatterns = [
    path('ShopPortables/',views.ShopPortables, name="ShopPortables"),
    #path('Details/',views.Details, name="Details"),
    path('SHOP/', views.SHOP, name="SHOP"),
    path('ShopPC/', views.ShopPC, name="ShopPC"),
    path('DetailsPC/<int:pk>/', views.DetailsPC, name="DetailsPC"),
    path('ShopCasques/', views.ShopCasques, name="ShopCasques"),
    path('ShopMontres/', views.ShopMontres, name="ShopMontres"),
    
    path('products/<str:category>/', views.product_list, name='product_list'),
    path('product/<int:pk>/', views.Details, name='Details'),
]
