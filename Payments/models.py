from django.db import models
from Orders.models import Commandes

class PaymentMethod(models.Model):
    method = models.CharField(max_length=50)  # Exemple: "Carte bancaire", "Mobile Money", "PayPal"

    def __str__(self):
        return self.method

class Payments(models.Model):
    order = models.OneToOneField(Commandes, on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True)  # ID de transaction de la passerelle de paiement
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('Pending', 'Pending'),
            ('Completed', 'Completed'),
            ('Failed', 'Failed'),
            ('Refunded', 'Refunded')
        ],
        default='Pending'
    )

    def __str__(self):
        return f"Payment {self.transaction_id} for Order {self.order.id}"

