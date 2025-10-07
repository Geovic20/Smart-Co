from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from Cart.models import Cart, CartItem
from Products.models import Products
import logging

logger = logging.getLogger(__name__)


@require_POST
@login_required
def add_to_cart(request):
    """
    Ajoute un produit au panier de l'utilisateur connecté
    """
    logger.debug(f"Received add_to_cart request: {request.POST}")
    
    product_id = request.POST.get('product_id')
    quantity = int(request.POST.get('quantity', 1))
    
    # Validation de la quantité
    if quantity <= 0:
        return JsonResponse({
            'status': 'error', 
            'message': 'Quantité invalide'
        }, status=400)
    
    # Vérification du produit
    try:
        product = Products.objects.get(id=product_id)
    except Products.DoesNotExist:
        return JsonResponse({
            'status': 'error', 
            'message': 'Produit introuvable'
        }, status=404)
    
    # Vérification du stock
    if hasattr(product, 'stock') and product.stock < quantity:
        return JsonResponse({
            'status': 'error', 
            'message': f'Stock insuffisant. Seulement {product.stock} disponible(s)'
        }, status=400)
    
    # Récupère ou crée le panier de l'utilisateur
    cart, created = Cart.objects.get_or_create(user=request.user)
    
    # Ajoute ou met à jour l'article
    item, item_created = CartItem.objects.get_or_create(
        cart=cart, 
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not item_created:
        # Vérification du stock total
        new_quantity = item.quantity + quantity
        if hasattr(product, 'stock') and product.stock < new_quantity:
            return JsonResponse({
                'status': 'error', 
                'message': f'Stock insuffisant. Maximum {product.stock} article(s)'
            }, status=400)
        
        item.quantity = new_quantity
        item.save()
        message = 'Quantité mise à jour'
    else:
        message = 'Ajouté au panier'
    
    # Calcul du nombre total d'articles
    total_items = cart.total_items()
    
    logger.info(f"Product {product_id} added to cart for user {request.user.id}")
    
    return JsonResponse({
        'status': 'success',
        'message': message,
        'total_items': total_items,
        'cart_total': cart.get_total_price()
    })


@require_POST
@login_required
def update_cart_quantity(request, item_id):
    """
    Met à jour la quantité d'un article dans le panier
    """
    quantity = int(request.POST.get('quantity', 1))
    
    try:
        item = CartItem.objects.select_related('product', 'cart').get(
            id=item_id, 
            cart__user=request.user
        )
    except CartItem.DoesNotExist:
        return JsonResponse({
            'status': 'error', 
            'message': 'Article introuvable'
        }, status=404)
    
    # Si quantité = 0, supprimer l'article
    if quantity <= 0:
        item.delete()
        return JsonResponse({
            'status': 'success',
            'message': 'Article supprimé',
            'cart_total': item.cart.get_total_price(),
            'total_items': item.cart.total_items()
        })
    
    # Vérification du stock
    if hasattr(item.product, 'stock') and item.product.stock < quantity:
        return JsonResponse({
            'status': 'error', 
            'message': f'Stock insuffisant. Maximum {item.product.stock} disponible(s)'
        }, status=400)
    
    # Mise à jour de la quantité
    item.quantity = quantity
    item.save()
    
    logger.info(f"CartItem {item_id} quantity updated to {quantity}")
    
    return JsonResponse({
        'status': 'success',
        'message': 'Quantité mise à jour',
        'item_total': item.product.price * item.quantity,
        'cart_total': item.cart.get_total_price(),
        'total_items': item.cart.total_items()
    })


@require_POST
@login_required
def remove_cart_item(request, item_id):
    """
    Supprime un article du panier
    """
    try:
        item = CartItem.objects.select_related('cart').get(
            id=item_id, 
            cart__user=request.user
        )
        cart = item.cart
        product_name = item.product.name
        item.delete()
        
        logger.info(f"CartItem {item_id} removed from cart")
        
        return JsonResponse({
            'status': 'success',
            'message': f'{product_name} supprimé du panier',
            'cart_total': cart.get_total_price(),
            'total_items': cart.total_items()
        })
    except CartItem.DoesNotExist:
        return JsonResponse({
            'status': 'error', 
            'message': 'Article introuvable'
        }, status=404)


@login_required
def clear_cart(request):
    """
    Vide complètement le panier de l'utilisateur
    """
    try:
        cart = Cart.objects.get(user=request.user)
        items_count = cart.cartitem_set.count()
        cart.cartitem_set.all().delete()
        
        logger.info(f"Cart cleared for user {request.user.id} - {items_count} items removed")
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'success',
                'message': 'Panier vidé'
            })
        else:
            return render(request, 'Chariot.html', {
                'cart': cart,
                'cart_items': [],
                'total': 0,
                'message': 'Panier vidé avec succès'
            })
    except Cart.DoesNotExist:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'error',
                'message': 'Panier introuvable'
            }, status=404)
        else:
            return render(request, 'Guest.html')


def Chariot(request):
    """
    Affiche le panier de l'utilisateur
    """
    if not request.user.is_authenticated:
        return render(request, 'Guest.html')
    
    # Récupère le panier avec optimisation des requêtes
    cart = Cart.objects.prefetch_related(
        'cartitem_set__product'
    ).filter(user=request.user).first()
    
    if not cart:
        # Crée un panier vide si n'existe pas
        cart = Cart.objects.create(user=request.user)
        cart_items = []
        total_general = 0
    else:
        cart_items = cart.cartitem_set.select_related('product').all()
        total_general = sum(
            item.product.price * item.quantity 
            for item in cart_items
        )
    
    # Calcul des frais
    shipping_cost = 0 if total_general > 75000 else 5000
    tax = total_general * 0.20
    grand_total = total_general + shipping_cost + tax
    
    context = {
        'cart': cart,
        'cart_items': cart_items,
        'total': total_general,
        'shipping_cost': shipping_cost,
        'tax': tax,
        'grand_total': grand_total,
        'free_shipping_threshold': 75000,
        'items_count': cart_items.count() if cart_items else 0
    }
    
    return render(request, 'Chariot.html', context)


@login_required
def get_cart_count(request):
    """
    Retourne le nombre total d'articles dans le panier (pour AJAX)
    """
    try:
        cart = Cart.objects.get(user=request.user)
        total_items = cart.total_items()
        
        return JsonResponse({
            'status': 'success',
            'total_items': total_items
        })
    except Cart.DoesNotExist:
        return JsonResponse({
            'status': 'success',
            'total_items': 0
        })


@login_required
def get_cart_summary(request):
    """
    Retourne un résumé complet du panier (pour AJAX)
    """
    try:
        cart = Cart.objects.prefetch_related('cartitem_set__product').get(
            user=request.user
        )
        
        items = []
        for item in cart.cartitem_set.all():
            items.append({
                'id': item.id,
                'product_id': item.product.id,
                'product_name': item.product.name,
                'product_price': float(item.product.price),
                'quantity': item.quantity,
                'total': float(item.product.price * item.quantity),
                'image_url': item.product.get_image_url() if hasattr(item.product, 'get_image_url') else ''
            })
        
        total = cart.get_total_price()
        shipping_cost = 0 if total > 75000 else 5000
        tax = total * 0.20
        
        return JsonResponse({
            'status': 'success',
            'items': items,
            'total_items': cart.total_items(),
            'subtotal': float(total),
            'shipping': float(shipping_cost),
            'tax': float(tax),
            'grand_total': float(total + shipping_cost + tax)
        })
    except Cart.DoesNotExist:
        return JsonResponse({
            'status': 'success',
            'items': [],
            'total_items': 0,
            'subtotal': 0,
            'shipping': 0,
            'tax': 0,
            'grand_total': 0
        })


def Guest(request):
    """
    Page pour les utilisateurs non connectés
    """
    return render(request, 'Guest.html')