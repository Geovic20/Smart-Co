from django.shortcuts import render, get_object_or_404
from .models import Products, Smartphones_tablets, PCs, Favori
from collections import defaultdict
from django.db.models import Q  # Pour des requêtes complexes
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

def SHOP(request):
    return render(request, 'SHOP.html')

def ShopCasques(request):
    return render(request, 'ShopCasques.html')


#Liste des produits de la catégorie "Ordinateur"
def ShopPC(request):
    query = request.GET.get('q', '').strip()

    # Récupération des produits de la catégorie "Ordinateur" avec les marques et les détails PC
    pcs_queryset = Products.objects.select_related('brand', 'pcs') \
        .filter(category="Ordinateur")

    # Filtrage par recherche (nom ou marque)
    if query:
        pcs_queryset = pcs_queryset.filter(
            Q(name__icontains=query) | Q(brand__name__icontains=query)
        )

    # Initialisation du regroupement
    grouped_pcs = defaultdict(list)

    # Identifiants des favoris de l'utilisateur
    favoris_ids = []
    if request.user.is_authenticated:
        # Récupération des IDs des produits favoris de l'utilisateur
        # pour marquer les produits comme favoris dans le template
        favoris_ids = Favori.objects.filter(utilisateur=request.user).values_list('produit_id', flat=True)

    # Regroupement des PCs par marque
    for pc in pcs_queryset:
        pc.est_favori = pc.id in favoris_ids  # ✅ Marque les favoris
        grouped_pcs[pc.brand.name].append(pc)

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

    # 🔎 Récupération de tous les produits de catégorie "Smartphone"
    products = Products.objects.select_related('smartphones_tablets', 'brand') \
        .filter(category='Smartphone')

    # 🔍 Filtrage par marque si précisée dans l'URL
    if selected_brand:
        products = products.filter(brand__name__iexact=selected_brand)

    # 🔍 Filtrage par mot-clé dans le nom ou la marque
    if query:
        products = products.filter(
            Q(name__icontains=query) | Q(brand__name__icontains=query)
        )

    #Regroupement des produits par marque dans un dictionnaire
    grouped_products = defaultdict(list)
    for product in products:
        grouped_products[product.brand.name].append(product)

    #Tri des marques par ordre alphabétique
    grouped_products = dict(sorted(grouped_products.items()))

    #Gestion des favoris : récupérer les IDs de produits favoris pour l'utilisateur connecté
    if request.user.is_authenticated:
        favoris_ids = Favori.objects.filter(utilisateur=request.user).values_list('produit_id', flat=True)
    else:
        favoris_ids = []

    #Ajouter un champ est_favori pour chaque produit (True ou False)
    for product_list in grouped_products.values():
        for prod in product_list:
            prod.est_favori = prod.id in favoris_ids

    #Envoi des données au template
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

# Détails d'un produit de la catégorie "Smartphone"
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

#Favoris
@require_POST
@csrf_exempt
def toggle_favori(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 'error', 'message': 'Authentication required'}, status=403)
    
    produit_id = request.POST.get('produit_id')
    if not produit_id:
        return JsonResponse({'status': 'error', 'message': 'Product ID missing'}, status=400)
    
    try:
        produit = Products.objects.get(id=produit_id)
    except Products.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Product not found'}, status=404)
    
    favori, created = Favori.objects.get_or_create(
        utilisateur=request.user,
        produit=produit
    )
    
    if not created:
        favori.delete()
        return JsonResponse({'status': 'removed'})
    
    return JsonResponse({'status': 'added'})

@login_required
def Favoris(request):
    favoris = Favori.objects.filter(utilisateur=request.user)
    return render(request, 'Favoris.html', {'favoris': favoris})