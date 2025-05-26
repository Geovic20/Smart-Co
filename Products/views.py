from django.shortcuts import render, get_object_or_404
from .models import Products, Smartphones_tablets, PCs
from collections import defaultdict
from django.db.models import Q  # Pour des requêtes complexes

def SHOP(request):
    return render(request, 'SHOP.html')

def ShopCasques(request):
    return render(request, 'ShopCasques.html')


#Liste des produits de la catégorie "Ordinateur"
def ShopPC(request):
    query = request.GET.get('q', '').strip()

    pcs_queryset = Products.objects.select_related('brand', 'pcs') \
        .filter(category="Ordinateur")

    if query:
        pcs_queryset = pcs_queryset.filter(
            Q(name__icontains=query) | Q(brand__name__icontains=query)
        )

    grouped_pcs = defaultdict(list)
    for pc in pcs_queryset:
        grouped_pcs[pc.brand.name].append(pc)

    # Tri par ordre alphabétique de marque
    grouped_pcs = dict(sorted(grouped_pcs.items()))

    return render(request, 'ShopPC.html', {
        'grouped_pcs': grouped_pcs,
        'query': query
    })

#Détails d'un produit de la catégorie "Ordinateur"
def DetailsPC(request, pk):
    product = get_object_or_404(Products, pk=pk)
    pc_details = get_object_or_404(PCs, product=product)
    
    context = {
        'product': product,
        'pc': pc_details
    }
    return render(request, 'DetailsPC.html', context)


def ShopMontres(request):
    return render(request, 'ShopMontres.html')


#Liste des produits de la catégorie "Smartphone"
def ShopPortables(request):
    selected_brand = request.GET.get('brand', '').strip()
    query = request.GET.get('q', '').strip()

    # Base : tous les smartphones
    products = Products.objects.select_related('smartphones_tablets', 'brand') \
        .filter(category='Smartphone')

    # Filtrage par marque
    if selected_brand:
        products = products.filter(brand__name__iexact=selected_brand)

    # Filtrage par recherche (nom ou marque)
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(brand__name__icontains=query)
        )

    # Regroupement par marque
    grouped_products = defaultdict(list)
    for product in products:
        grouped_products[product.brand.name].append(product)

    # Trier par nom de marque (facultatif mais propre)
    grouped_products = dict(sorted(grouped_products.items()))

    return render(request, 'ShopPortables.html', {
        'grouped_products': grouped_products,
        'selected_brand': selected_brand,
        'query': query
    })


#Détails d'un produit de la catégorie "Smartphone"
def product_list(request, category):
    products = Products.objects.select_related(
        'smartphones_tablets',
        'brand'
    ).filter(category=category)
    return render(request, 'ShopPortables.html', {'products': products})


def Details(request, pk):
    # Récupère le produit ou renvoie 404 si non trouvé
    product = get_object_or_404(Products, pk=pk)
    
    # Essaye de récupérer les détails spécifiques au smartphone
    try:
        Smartphone_details = product.smartphones_tablets
    except Smartphones_tablets.DoesNotExist:
        Smartphone_details = None
    
    context = {
        'product': product,
        'smartphone_details': Smartphone_details
    }
    return render(request, 'Details.html', context)

