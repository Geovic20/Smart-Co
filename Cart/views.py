from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from Cart.models import Cart, CartItem
from Products.models import Products
from django.db import transaction
import logging

logger = logging.getLogger(__name__)


@require_POST
def add_to_cart(request):
    # Vérification authentification
    if not request.user.is_authenticated:
        return JsonResponse({
            'status': 'redirect',
            'message': 'Authentification requise',
            'url': '/login_signup/?next=' + request.path
        }, status=401)

    product_id = request.POST.get('product_id')
    qty_raw = request.POST.get('quantity', '1')

    #Validation de la quantité
    try:
        quantity = int(qty_raw)
    except (TypeError, ValueError):
        return JsonResponse({'status': 'error', 'message': 'Quantité invalide'}, status=400)

    if quantity <= 0:
        return JsonResponse({'status': 'error', 'message': 'Quantité invalide'}, status=400)

    try:
        with transaction.atomic():
            product = Products.objects.select_for_update().get(id=product_id)

            # Vérif stock (si tu as un champ stock_quantity)
            if hasattr(product, 'stock_quantity') and product.stock_quantity < quantity:
                return JsonResponse({
                    'status': 'error',
                    'message': f'Stock insuffisant. Disponible : {product.stock_quantity}'
                }, status=400)
            
            #Récupérer ou créer le panier
            cart, created = Cart.objects.get_or_create(user=request.user)
            
            #Récupérer ou créer l'item du panier
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,  # Correction : prodcut -> product
                defaults={'quantity': quantity}
            )
                
            #Si l'item existe déjà, augmenter la quantité
            if not item_created:
                new_quantity = cart_item.quantity + quantity
                if hasattr(product, 'stock_quantity') and new_quantity > product.stock_quantity:
                    return JsonResponse({
                        'status': 'error',
                        'message': f'Stock insuffisant. Max : {product.stock_quantity}'
                    }, status=400)
                cart_item.quantity = new_quantity  
                cart_item.save()
                
            #Calcul des totaux
            total_items = cart.total_items()
            total_price = cart.get_total_price()
           
            return JsonResponse({
                'status': 'success',
                'message': f'{product.name} ajouté au panier',
                'total_items': total_items,
                'total_price': float(total_price),
                'cart_item_id': cart_item.id
            })

    except Products.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Produit introuvable'}, status=404)
    except Exception as e:
        logger.exception("Erreur add_to_cart: %s", e)
        return JsonResponse({'status': 'error', 'message': 'Erreur serveur'}, status=500)


@require_POST
@login_required
def update_cart_quantity(request, item_id):
    """Modifier la quantité d'un article dans le panier"""
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
    if hasattr(item.product, 'stock_quantity') and item.product.stock_quantity < quantity:
        return JsonResponse({
            'status': 'error', 
            'message': f'Stock insuffisant. Maximum {item.product.stock_quantity} disponible(s)'
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
def remove_cart_item(request, item_id):
    """Supprime un article du panier"""
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Non authentifié'}, status=401)
    
    try:
        cart_item = CartItem.objects.select_related('cart').get(
            id=item_id, 
            cart__user=request.user
        )
        cart = cart_item.cart
        cart_item.delete()
        
        total_items = cart.total_items()
        total_price = cart.get_total_price()
        
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'success',
                'message': 'Article supprimé',
                'total_items': total_items,
                'total_price': float(total_price)
            })
        else:
            # Redirection si pas AJAX
            from django.shortcuts import redirect
            return redirect('Chariot')
        
    except CartItem.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Item introuvable'}, status=404)
    except Exception as e:
        logger.error(f"Erreur remove_cart : {e}")
        return JsonResponse({'status': 'error', 'message': 'Erreur serveur'}, status=500)

@login_required
@require_POST
def clear_cart(request):
    """Vide complètement le panier de l'utilisateur"""
    try:
        cart = Cart.objects.get(user=request.user)
        items_count = cart.cartitem_set.count()
        cart.cartitem_set.all().delete()
        logger.info(f"Cart cleared for user {request.user.id} - {items_count} items removed")

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'success', 'message': 'Panier vidé'})
        else:
            return render(request, 'Chariot.html', {
                'cart': cart,
                'cart_items': [],
                'total': 0,
                'message': 'Panier vidé avec succès'
            })
    except Cart.DoesNotExist:
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'status': 'error', 'message': 'Panier introuvable'}, status=404)
        else:
            return render(request, 'Guest.html')

def Chariot(request):
    """Affiche le panier de l'utilisateur"""
    
    if not request.user.is_authenticated:
        return render(request, 'Guest.html')

    # Une seule requête optimisée
    cart = (Cart.objects
            .filter(user=request.user)
            .prefetch_related('cartitem_set__product')
            .first())

    if not cart:
        cart = Cart.objects.create(user=request.user)
        cart_items = []
        total_general = 0
    else:
        cart_items = cart.cartitem_set.select_related('product').all()
        total_general = sum(item.product.price * item.quantity for item in cart_items)

    shipping_cost = 0 if total_general > 75000 else 5000
    grand_total = total_general + shipping_cost

    return render(request, 'Chariot.html', {
        'cart': cart,
        'cart_items': cart_items,
        'total': total_general,
        'shipping': shipping_cost,
        'grand_total': grand_total
    })

@login_required
def get_cart_count(request):
    """ Retourne le nombre total d'articles dans le panier (pour AJAX)"""
    try:
        cart = Cart.objects.get(user=request.user)
        total_items = cart.total_items()
        print(f"Debug: Total items = {total_items}")  # Ajout pour débogage
        return JsonResponse({
            'status': 'success',
            'total_items': total_items
        })
    except Cart.DoesNotExist:
        print("Debug: Cart not found for user")
        return JsonResponse({
            'status': 'success',
            'total_items': 0
        })

@login_required
def get_cart_summary(request):
    """Retourne un résumé complet du panier (pour AJAX)"""
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
        
        return JsonResponse({
            'status': 'success',
            'items': items,
            'total_items': cart.total_items(),
            'subtotal': float(total),
            'shipping': float(shipping_cost),
            'grand_total': float(total + shipping_cost)
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
    """Page pour les utilisateurs non connectés"""
    return render(request, 'Guest.html')


