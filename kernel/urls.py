"""
URL configuration for kernel project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('secret-admin/', admin.site.urls),
    path('', include('Smarthub.urls')),
    path('Cart/', include('Cart.urls')),
    path('Orders/', include('Orders.urls')),
    path('Payments/', include('Payments.urls')),
    path('Products/', include('Products.urls')),
    path('accounts', include('django.contrib.auth.urls')),
    path('accounts/', include('Users.urls')),
]

#Ajout de la gestion des fichiers médias en mode développeùent 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    