from django import template
from Cart.models import Cart

register = template.Library()


@register.filter
def mul(value, arg):
    """
    Multiplie deux valeurs
    Usage: {{ price|mul:quantity }}
    """
    try:
        return float(value) * float(arg)
    except (ValueError, TypeError, AttributeError):
        return 0


@register.simple_tag
def show_cart_items_count(user):
    """
    Retourne le nombre total d'articles dans le panier
    Usage: {% show_cart_items_count user %}
    """
    if not user or not user.is_authenticated:
        return 0
    
    try:
        cart = Cart.objects.get(user=user)
        return cart.total_items()
    except Cart.DoesNotExist:
        return 0