from . import views
from django.urls import path

urlpatterns = [ 
    path('About/',views.About, name="About"),
    path('',views.index, name="index"),
    path('Contact/',views.Contact, name="Contact"),   
    path('Livraisons/',views.Livraisons, name="Livraisons"), 
    path('PoliConfi/',views.PoliConfi, name="PoliConfi"),
    path('Termes/', views.Termes, name="Termes"),
    path('recherche/', views.recherche, name='recherche'),
    path('FAQ/', views.FAQ, name='FAQ'),
]
