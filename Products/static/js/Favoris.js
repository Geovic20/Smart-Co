function toggleFavorite(element) {
  const icon = element.querySelector("i");
  const produitId = element.dataset.id;

  fetch('Favoris/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': getCookie('csrftoken') // Django CSRF token
    },
    body: `produit_id=${produitId}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'added') {
      icon.classList.remove('far');
      icon.classList.add('fas');
    } else {
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
  });
}
