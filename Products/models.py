from django.db import models
from kernel import settings

class Brands(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Products(models.Model):
    category = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brands, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    stock_quantity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_image_url(self):
        """Retourne l'URL de l'image du produit."""
        sous_tables = [
            'smartphones_tablets',
            'casques_ecouteurs',
            'pcs'
        ]
        for attr in sous_tables:
            related = getattr(self, attr, None)
            if related and hasattr(related, 'image') and related.image:
                return related.image.url
        # Si aucune image n'est trouvée dans les sous-tables, retourne l'image du produit lui-même
        return '/static/images/default_image.jpg'  # Chemin par défaut si aucune image n'est trouvée
                
    def __str__(self):
        return self.name

class Smartphones_tablets(models.Model):
    product = models.OneToOneField(Products, on_delete=models.CASCADE, primary_key=True)
    ram = models.IntegerField()
    storage = models.IntegerField()
    camera_pixels = models.IntegerField()
    screen_size = models.DecimalField(max_digits=4, decimal_places=2)
    battery = models.IntegerField()
    processor = models.CharField(max_length=100)
    image = models.ImageField(upload_to='products/', default='default_image.jpg')  # Stocke directement l'image

    def __str__(self):
        return self.product.name

class Casques_ecouteurs(models.Model):
    product = models.OneToOneField(Products, on_delete=models.CASCADE, primary_key=True)
    battery_life = models.IntegerField()
    image = models.ImageField(upload_to='products/', default='default_image.jpg')  # Stocke directement l'image

    def __str__(self):
        return self.product.name

class PCRange(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class PCs(models.Model):
    product = models.OneToOneField(Products, on_delete=models.CASCADE, primary_key=True)
    pc_status = models.CharField(max_length=20, default='Neuf')  # Neuf, Venu, etc.
    pc_range = models.ForeignKey(PCRange, on_delete=models.SET_NULL, null=True)# PAVILION, ELITEBOOK, etc.
    core = models.CharField(max_length=20)  # i5, i7, etc.
    generation = models.CharField(max_length=20)
    clavier = models.CharField(max_length=20)  # clavier lumineur : oui ou non
    ram = models.CharField(max_length=20)  # ex: "8 Go"
    storage = models.CharField(max_length=20)  # ex: "512 Go SSD"
    processor = models.CharField(max_length=50)
    graphics_card = models.CharField(max_length=50)
    refresh_rate = models.CharField(max_length=50)  # ex: "144 Hz"
    core_count = models.IntegerField()
    logical_processors = models.IntegerField()
    battery_life = models.IntegerField()  # en heures
    image = models.ImageField(upload_to='products/', default='default_image.jpg')  # Stocke directement l'image
    
    def __str__(self):
        return self.product.name


class Images(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    image_url = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255)

    def __str__(self):
        return f"Image for {self.product.name}"

#Favoris
class Favori(models.Model):
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='favoris'
    )
    produit = models.ForeignKey(
        Products,
        on_delete=models.CASCADE,
        related_name='favoris'
    )
    date_ajout = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('utilisateur', 'produit')
        ordering = ['-date_ajout']

    def __str__(self):
        return f"{self.utilisateur.email} a ajouté {self.produit.nom} aux favoris"
 
