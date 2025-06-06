function toggleFavorite(element, produitId) {
    fetch("{% url 'toggle_favori' %}", {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'produit_id=' + produitId
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'added') {
            element.querySelector('i').classList.add('text-red-500');
        } else {
            element.querySelector('i').classList.remove('text-red-500');
            location.reload(); // Recharge la page si supprimé des favoris
        }
    });
}