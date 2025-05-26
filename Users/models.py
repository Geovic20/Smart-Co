from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomerManager  # <-- importe le manager

class Customers(AbstractUser):
    username = None  # On désactive le champ username car on utilisera email
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'  # Utilise email comme identifiant
    REQUIRED_FIELDS = ['first_name', 'last_name']  # Champs obligatoires
    
    objects = CustomerManager()  # <-- ici le manager est appliqué

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
#Préférences
class UserPreferences(models.Model):
    THEME_CHOICES = [
        ('light', 'Blanc'),
        ('dark', 'Sombre'),
    ]

    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('en', 'Anglais'),
    ]

    CURRENCY_CHOICES = [
        ('XOF', 'Franc CFA'),
        ('USD', 'Dollar'),
        ('EUR', 'Euro'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='preferences')
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='fr')
    preferred_brands = models.ManyToManyField('Products.Brands', blank=True)  
    currency = models.CharField(max_length=5, choices=CURRENCY_CHOICES, default='XOF')

    def __str__(self):
        return f"Préférences de {self.user.email}"