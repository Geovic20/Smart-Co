function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function toggleFavorite(element) {
    //Vérifier si l'utilisateur est connecté
    const isAuthenticated = document.body.dataset.authenticated === 'True';
    if (!isAuthenticated) {
        window.location.href = `${Login}?next=${encodeURIComponent(window.location.pathname)}`;
        return;
    }

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


