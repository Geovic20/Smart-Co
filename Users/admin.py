from django.contrib import admin
from Users.models import Customers, UserPreferences

#Modèle pour Users
admin.site.register(Customers)
admin.site.register(UserPreferences)
