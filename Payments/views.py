from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required
from Cart.models import Cart
from Orders.models import Commandes, Order_status, Commande_items
from Payments.models import Payments, PaymentMethod
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

# Create your views here.
def Payments(request):
    """Affiche la page de paiement avec les détails du panier"""
    
    # Récupérer le panier de l'utilisateur
    cart = Cart.objects.filter(user=request.user).prefetch_related('cartitem_set__product').first()
    
    if not cart or cart.total_items() == 0:
        # Rediriger vers le panier si vide
        return redirect('Chariot')
    
    cart_items = cart.cartitem_set.select_related('product').all()
    
    # Calculer le sous-total (montant de la commande sans frais de livraison)
    subtotal = sum(item.product.price * item.quantity for item in cart_items)
    
    # Les frais de livraison seront calculés dynamiquement en JS selon le quartier
    # On envoie juste le subtotal initial
    shipping_cost = 0
    
    # Grand total initial (sera mis à jour en JS)
    grand_total = subtotal + shipping_cost
    
    # Logs pour le débogage
    logger.debug(f"Subtotal (montant commande): {subtotal}")
    logger.debug(f"Grand total initial: {grand_total}")
    
    # Passer le nom de l'utilisateur
    user_name = f"{request.user.first_name} {request.user.last_name}" if request.user.first_name or request.user.last_name else request.user.username 
    
    return render(request, 'Payments.html', {
        'subtotal': subtotal,  # Montant de la commande (sans livraison)
        'shipping_cost': shipping_cost,  # Frais de livraison initiaux
        'grand_total': grand_total,  # Total général initial
        'user_name': user_name,
    })

@csrf_protect
@login_required
@require_POST
def process_payment(request):
    """Traite le paiement et crée la commande"""
    try:
        # Récupérer le panier
        cart = Cart.objects.get(user=request.user)
        cart_items = cart.cartitem_set.all()
        
        # Calculer le sous-total
        subtotal = sum(item.product.price * item.quantity for item in cart_items)
        
        # Récupérer les frais de livraison du formulaire
        quartier = request.POST.get('quartier')
        # Vous devrez mapper les quartiers aux frais, ou les envoyer depuis le JS
        shipping_cost = Decimal(request.POST.get('shipping_cost', '0'))
        
        # Calculer le total général
        grand_total = subtotal + shipping_cost

        # Valider les données de livraison
        delivery_data = {
            'quartier': quartier,
            'details': request.POST.get('details'),
            'phone': request.POST.get('phone'),
            'jour': request.POST.get('jour'),
            'heure': request.POST.get('heure'),
        }
        payment_method_name = request.POST.get('payment-method')

        if not all(delivery_data.values()) or not payment_method_name:
            return JsonResponse({'status': 'error', 'message': 'Tous les champs sont obligatoires.'}, status=400)

        # Récupérer ou créer le statut et la méthode de paiement
        status, _ = Order_status.objects.get_or_create(status='pending')
        payment_method, _ = PaymentMethod.objects.get_or_create(method=payment_method_name)

        # Créer la commande
        order = Commandes.objects.create(
            customer=request.user.customer,
            status=status,
            shipping_cost=shipping_cost,
            **delivery_data
        )

        # Ajouter les items de la commande
        for item in cart_items:
            Commande_items.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity
            )

        # Mettre à jour total_price
        order.total_price = order.calculate_total()
        order.save()

        # Créer le paiement
        payment = Payments.objects.create(
            order=order,
            payment_method=payment_method,
            amount_paid=grand_total
        )

        # Simuler un paiement
        transaction_id = f"TXN-{order.id}-SIM"
        payment.transaction_id = transaction_id
        payment.status = 'completed'
        payment.save()
        order.status = Order_status.objects.get(status='completed')
        order.save()

        # Vider le panier
        cart_items.delete()
        cart.delete()

        return JsonResponse({
            'status': 'success',
            'message': 'Paiement réussi !',
            'transaction_id': transaction_id,
            'total_amount': float(grand_total)
        })

    except Cart.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Panier non trouvé.'}, status=404)
    except Exception as e:
        logger.error(f"Erreur lors du paiement : {e}")
        return JsonResponse({'status': 'error', 'message': 'Erreur serveur.'}, status=500)