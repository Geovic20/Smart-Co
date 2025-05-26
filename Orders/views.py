from django.shortcuts import redirect, render
from Cart.models import Cart, CartItem
from Orders.models import Commandes

# Create your views here.
def Commandes(request):
    return render(request, 'Commandes.html')

#Vue pour passer une commande
def create_order(request):
    # Vérifie si l'utilisateur a un panier
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    # Si le panier est vide, rediriger vers la page d'accueil ou une autre page
    if not cart.cartitem_set.exists():
        return redirect('cart')  # Assure-toi d'avoir une vue et une URL pour cela
    
    # Créer la commande
    order = Commandes.objects.create(user=request.user, total_price=0)
    
    # Calculer le prix total et ajouter les items de commande
    total_price = 0
    for item in cart.cartitem_set.all():
        CartItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )
        total_price += item.product.price * item.quantity
    
    # Mettre à jour le total de la commande
    order.total_price = total_price
    order.save()
    
    # Vider le panier après la commande
    cart.cartitem_set.all().delete()
    
    # Rediriger vers le détail de la commande
    return redirect('order_detail', order_id=order.id)