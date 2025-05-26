from django.contrib import admin
from Payments.models import PaymentMethod, Payments

# Register your models here.
admin.site.register(PaymentMethod)
admin.site.register(Payments)
