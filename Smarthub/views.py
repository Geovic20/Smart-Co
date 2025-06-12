from django.shortcuts import render
from Products.models import Products
from django.db.models import Q
from .models import Products

# Create your views here.

def About(request):
    return render(request, 'About.html')

def index(request):
    latest_products = Products.objects.order_by('-created_at')[:8]
    return render(request, 'index.html', {
        'latest_products': latest_products,
    })

def Contact(request):
    return render(request, 'Contact.html')

def Livraisons(request):
    return render(request, 'Livraisons.html')

def PoliConfi(request):
    return render(request, 'PoliConfi.html')

def Termes(request):
    return render(request, 'Termes.html')


def recherche(request):
    query = request.GET.get('q', '').strip()
    results = []

    if query:
        results = Products.objects.select_related('brand', 'pcs', 'smartphones_tablets').filter(
            Q(name__icontains=query) |
            Q(brand__name__icontains=query) |
            Q(description__icontains=query)  # si tu as un champ "description"
        )

    return render(request, 'recherche.html', {
        'query': query,
        'results': results,
    })

def FAQ(request):
    return render(request, 'FAQ.html')