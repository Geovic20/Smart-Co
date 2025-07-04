from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from Cart.models import Cart, CartItem
from Products.models import Products
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST

import logging
logger = logging.getLogger(__name__)
# Cart/views.py
@require_POST
@login_required
def add_to_cart(request):
    logger.debug(f"Received add_to_cart request: {request.POST}")
    product_id = request.POST.get('product_id')
    quantity = int(request.POST.get('quantity', 1))
    
    if not request.user.is_authenticated:
        return JsonResponse({
            'status': 'redirect', 
            'url': reverse('login_signup')  # Assurez-vous que 'login_signup' est le nom de votre URL de connexion
        }, status=401)

    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Produit introuvable'}, status=404)

    # Récupère ou crée le panier de l'utilisateur
    cart, _ = Cart.objects.get_or_create(user=request.user)

    # Ajoute ou met à jour l’article
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    item.save()

    return JsonResponse({
        'status': 'success',
        'message': 'Ajouté au panier',
        'total_items': cart.total_items()
    })


def Chariot(request):
    if not request.user.is_authenticated:
        return render(request, 'Guest.html')
    
    cart = Cart.objects.filter(user=request.user).first()  # évite erreur si aucun panier

    cart_items = cart.cartitem_set.all() if cart else []

    total_general = sum(item.product.price * item.quantity for item in cart_items)

    return render(request, 'Chariot.html', {
        'cart': cart,
        'cart_items': cart_items,
        'total': total_general
    })
    
def Guest(request):
    return render(request, 'Guest.html')