from django.db import models
from Users.models import Customers
from Products.models import Products

class Order_status(models.Model):
    status = models.CharField(max_length=20)

    def __str__(self):
        return self.status

class Commandes(models.Model):
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.ForeignKey(Order_status, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.id} by {self.customer.name}"

class Commande_items(models.Model):
    order = models.ForeignKey(Commandes, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"

