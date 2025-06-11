from django.db import models
from django.contrib.auth.models import User
from Products.models import Products
from kernel import settings


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart {self.id}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    

