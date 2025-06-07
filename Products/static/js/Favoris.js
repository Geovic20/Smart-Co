function toggleFavorite(element) {
    console.log("Bouton favori cliqué !");
    const produitId = element.dataset.produitId;
    console.log("Produit ID :", produitId);

    if (!produitId) {
        console.error("ID de produit manquant !");
        return;
    }

    fetch('/Products/toggle-favori/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')  // si CSRF activé
        },
        body: `produit_id=${produitId}`
    })
    .then(response => response.json())
    .then(data => {
        console.log("Réponse du serveur :", data);

        const icon = element.querySelector('i');
        if (data.status === 'added') {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-red-500');
        } else if (data.status === 'removed') {
            icon.classList.remove('fas', 'text-red-500');
            icon.classList.add('far');
        }
    });
}

console.log("Fichier JS chargé");

