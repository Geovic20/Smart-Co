from django.shortcuts import get_object_or_404, render, redirect
from Cart.models import Cart, CartItem
from Products.models import Products

# Create your views here.
def Chariot(request):
    return render(request, 'Chariot.html')

def add_to_cart(request, product_id):
    product = get_object_or_404(Products, id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('cart_detail')

def cart_detail(request):
    cart = Cart.objects.get(user=request.user)
    return render(request, 'cart/cart_detail.html', {'cart': cart})