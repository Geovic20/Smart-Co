from django.contrib import admin
from Products.models import Products, Smartphones_tablets, Casques_ecouteurs, PCRange, PCs, Images, Brands, Favori

#Modèles pour Products
admin.site.register(Brands)
admin.site.register(Products)
admin.site.register(Smartphones_tablets)
admin.site.register(Casques_ecouteurs)
admin.site.register(PCs)
admin.site.register(Images)
admin.site.register(PCRange)
admin.site.register(Favori)
