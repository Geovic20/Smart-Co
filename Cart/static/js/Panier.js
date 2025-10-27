document.addEventListener('DOMContentLoaded', function() {
    // ==================== CONFIGURATION ====================
    const ADD_TO_CART_URL = window.URLS?.add_to_cart || '/Cart/panier/ajouter/';  // Fallback si undefined
    const UPDATE_CART_URL = window.URLS?.update_cart || 'Cart//panier/modifier/';
    const REMOVE_CART_URL = window.URLS?.remove_cart || 'Cart//panier/supprimer/';
    const CART_URL = window.URLS?.cart || 'Cart//Chariot/';  // Ajoute cart si défini dans window.URLS

    // ==================== ELEMENTS ====================
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const removeButtons = document.querySelectorAll('.remove-item');
    const promoButton = document.getElementById('apply-promo');
    const checkoutButton = document.getElementById('checkout');
    const saveLaterButtons = document.querySelectorAll('.save-for-later');
    const warrantyOptions = document.querySelectorAll('.warranty-option input');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // ==================== HELPER FUNCTIONS ====================
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

    function showMessage(text, type = 'success') {
        const message = document.createElement('div');
        message.className = `alert-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
            background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    // ==================== UPDATE TOTALS ====================
    function updateTotals() {
        let subtotal = 0;
        const items = document.querySelectorAll('.cart-item');
        
        items.forEach(item => {
            const priceText = item.querySelector('.price').textContent.replace(/[^\d]/g, '');
            const price = parseFloat(priceText) || 0;
            const quantity = parseInt(item.querySelector('.quantity-input').value) || 1;
            const itemTotal = price * quantity;
            
            // Warranty cost (optional)
            const selectedWarranty = item.querySelector('.warranty-option input:checked');
            if (selectedWarranty && selectedWarranty.dataset.cost) {
                const warrantyCost = parseFloat(selectedWarranty.dataset.cost);
                subtotal += warrantyCost;
            }
            
            const itemTotalElement = item.querySelector('.item-total');
            if (itemTotalElement) {
                itemTotalElement.textContent = `${price.toLocaleString()} x ${quantity} = ${itemTotal.toLocaleString()} F CFA`;
            }
            subtotal += itemTotal;
        });

        const total = subtotal;

        // Update DOM
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        if (subtotalElement) subtotalElement.textContent = `${Math.round(subtotal).toLocaleString()} F CFA`;
        if (totalElement) totalElement.textContent = `${Math.round(total).toLocaleString()} F CFA`;

        updateCartCount();
    }

    // ==================== UPDATE CART COUNT ====================
    function updateCartCount() {
        const items = document.querySelectorAll('.cart-item');
        let totalQuantity = 0;

        if (items.length > 0) {
            // Sur Chariot.html : calculer à partir du DOM
            totalQuantity = Array.from(items).reduce((sum, item) => {
                const quantity = parseInt(item.querySelector('.quantity-input').value) || 0;
                return sum + quantity;
            }, 0);
        } else {
            // Sur autres pages : appel AJAX
            fetch('/Cart/get_cart_count/', {
                method: 'GET',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur serveur: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    totalQuantity = data.total_items || 0;
                } else {
                    console.error('Erreur AJAX:', data.message);
                }
                updateDisplay(totalQuantity);
            })
            .catch(error => {
                console.error('Erreur réseau:', error);
                updateDisplay(0);
            });
            return;  // Asynchrone, sortie anticipée
        }
        updateDisplay(totalQuantity);
    }

    // Met à jour l'affichage du nombre d'articles dans le panier
    function updateDisplay(totalQuantity) {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalQuantity;
        }

        const cartHeader = document.querySelector('.cart-header h2');
        if (cartHeader) {
            cartHeader.textContent = `Panier de Géovic (${totalQuantity} articles)`;
        }
    }

    // ==================== QUANTITY CONTROLS ====================
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            const itemId = this.dataset.id;
            const quantity = parseInt(this.value);
            updateCartItemQuantity(itemId, quantity);
        });
    });

    plusButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.closest('.quantity-controls').querySelector('.quantity-input');
            let value = parseInt(input.value) || 1;
            const maxStock = parseInt(input.max) || Infinity; // Utilisez input.max au lieu de dataset.maxStock
            if (value < maxStock) {
                input.value = ++value;
                updateCartItemQuantity(input.dataset.id, value); // Corrigez ici
            } else {
                showMessage('Stock maximum atteint', 'error');
            }
        });
    });

    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.id;
            const input = document.querySelector(`.quantity-input[data-id="${itemId}"]`);
            if (input && input.value > 1) {
                const newQuantity = parseInt(input.value) - 1;
                input.value = newQuantity;
                updateCartItemQuantity(itemId, newQuantity);
            }
        });
    });

    // ==================== UPDATE CART ITEM (AJAX) ====================
    function updateCartItemQuantity(itemId, quantity) {
        fetch(`${UPDATE_CART_URL}${itemId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `quantity=${quantity}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Mettre à jour l'élément spécifique
                const item = document.querySelector(`.cart-item .quantity-input[data-id="${itemId}"]`);
                if (item) {
                    const itemTotalElement = item.closest('.cart-item').querySelector('.item-total');
                    if (itemTotalElement) {
                        itemTotalElement.textContent = `${data.item_total.toLocaleString()} F CFA`;
                    }
                }
                updateTotals();
                showMessage('Panier mis à jour', 'success');
            } else {
                showMessage('Erreur lors de la mise à jour: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('Erreur de connexion', 'error');
        });
    }

    // ==================== REMOVE ITEM ====================
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!confirm('Voulez-vous vraiment supprimer cet article ?')) {
                return;
            }

            const form = this.closest('form');
            const actionUrl = form.action;

            fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `csrfmiddlewaretoken=${getCookie('csrftoken')}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const cartItem = this.closest('.cart-item');
                    cartItem.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        cartItem.remove();
                        updateTotals();
                        
                        // Check if cart is empty
                        const remainingItems = document.querySelectorAll('.cart-item').length;
                        if (remainingItems === 0) {
                            showEmptyCartMessage();
                        }
                    }, 300);
                    
                    showMessage('Article supprimé', 'success');
                } else {
                    showMessage('Erreur lors de la suppression', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Erreur de connexion', 'error');
            });
        });
    });

    // ==================== EMPTY CART MESSAGE ====================
    function showEmptyCartMessage() {
        const cartContainer = document.querySelector('.cart-items');
        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="empty-cart" style="text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-cart-shopping" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>Votre panier est vide</h3>
                    <p style="color: #666; margin: 1rem 0;">Découvrez nos produits et ajoutez-les à votre panier</p>
                    <a href="/SHOP/" class="checkout-btn" style="display: inline-block; margin-top: 1rem;">Continuer mes achats</a>
                </div>
            `;
        }
    }

    // ==================== ADD TO CART  ====================
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
    
          const productId = this.dataset.id;
          if (!productId) {
            showMessage("ID produit manquant", 'error');
            return;
          }
    
          // Récupérer la quantité dynamique si input présent (e.g., page détails), sinon 1
          const quantityInput = this.closest('.details_produit')?.querySelector('#quantity-input');
          const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

          if (isNaN(quantity) || quantity <= 0) {
            showMessage("Quantité invalide", 'error');
            return;
          }

          console.log('Sending to:', ADD_TO_CART_URL, 'with productId:', productId, 'quantity:', quantity);
          
          // Feedback visuel
          const originalText = this.textContent;
          this.textContent = 'Ajout...';
          this.disabled = true;
    
          fetch(ADD_TO_CART_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-CSRFToken': getCookie('csrftoken'),
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: `product_id=${encodeURIComponent(productId)}&quantity=1`
          })
          .then(async (response) => {
            let data = {};
            try { data = await response.json(); } catch (e) {}
    
            if (response.status === 401 && data.status === 'redirect' && data.url) {
              window.location.href = data.url;
              return;
            }
    
            if (!response.ok) {
              throw new Error(data.message || 'Erreur lors de l’ajout au panier');
            }
    
            // Succès
            document.querySelectorAll('#cart-count').forEach(el => {
                if (data.total_items != null) el.textContent = data.total_items;
              });
              showMessage('Ajouté au panier ✅', 'success');
            })
            .catch(err => {
              showMessage(err.message || 'Erreur réseau', 'error');
            })
            .finally(() => {
              this.textContent = originalText;
              this.disabled = false;
            });
        });
    });

    // ==================== SAVE FOR LATER ====================
    saveLaterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            const savedItems = document.querySelector('.saved-items');
            
            if (!savedItems) return;

            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h3').textContent;
            const price = item.querySelector('.price').textContent;
            
            const savedItem = document.createElement('div');
            savedItem.className = 'saved-item';
            savedItem.style.cssText = 'display: flex; align-items: center; padding: 1rem; border: 1px solid #ddd; margin-bottom: 1rem; border-radius: 8px;';
            savedItem.innerHTML = `
                <img src="${imgSrc}" alt="${title}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 1rem; border-radius: 4px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${title}</h4>
                    <p style="margin: 0; color: #666;">${price}</p>
                </div>
                <button class="move-to-cart" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Remettre au panier</button>
            `;
            
            savedItems.appendChild(savedItem);
            item.remove();
            updateTotals();
            showMessage('Article sauvegardé pour plus tard', 'success');
        });
    });

    // ==================== WARRANTY OPTIONS ====================
    warrantyOptions.forEach(option => {
        option.addEventListener('change', updateTotals);
    });

    // ==================== PROMO CODE ====================
    if (promoButton) {
        promoButton.addEventListener('click', function() {
            const promoInput = document.getElementById('promo');
            if (!promoInput) return;

            const promoCode = promoInput.value.trim().toUpperCase();
            
            // Simple validation (à adapter selon vos besoins)
            if (promoCode === 'WELCOME10') {
                showMessage('Code promo appliqué ! -10% sur votre commande', 'success');
                // TODO: Implémenter la réduction côté serveur
            } else if (promoCode === '') {
                showMessage('Veuillez entrer un code promo', 'error');
            } else {
                showMessage('Code promo invalide', 'error');
            }
        });
    }

    // ==================== INITIALIZATION ====================
    updateTotals();
    updateCartCount();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});