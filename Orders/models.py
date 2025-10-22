from django.db import models
from Users.models import Customers
from Products.models import Products

class Order_status(models.Model):
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'En attente'),
            ('completed', 'Complété'),
            ('failed', 'Échoué'),
            ('shipped', 'Expédié')
        ]
    )

    def __str__(self):
        return self.status
    

class Commandes(models.Model):
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.ForeignKey(Order_status, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Calculé dynamiquement
    first_name = models.CharField(max_length=50, default="John")
    last_name = models.CharField(max_length=50 , default="Doe")
    address = models.CharField(max_length=200, default="Godomey")
    city = models.CharField(max_length=100, default="Cotonou")
    phone = models.CharField(max_length=15, default="0190835005")
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Order {self.id} by {self.customer.name}"

    def calculate_total(self):
        return sum(item.unit_price * item.quantity for item in self.commande_items.all()) + self.shipping_cost
    

class Commande_items(models.Model):
    order = models.ForeignKey(Commandes, on_delete=models.CASCADE, related_name='commande_items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"
