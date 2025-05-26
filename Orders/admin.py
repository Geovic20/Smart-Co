from django.contrib import admin
from Orders.models import Commandes, Commande_items, Order_status

#Modèles pour Orders
admin.site.register(Commandes)
admin.site.register(Commande_items)
admin.site.register(Order_status)

