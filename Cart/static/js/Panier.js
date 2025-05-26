document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const removeButtons = document.querySelectorAll('.remove-item');
    const promoButton = document.getElementById('apply-promo');
    const checkoutButton = document.getElementById('checkout');
    const saveLaterButtons = document.querySelectorAll('.save-later');
    const warrantyOptions = document.querySelectorAll('.warranty-option input');

    // Add new elements for suggestions
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Update shipping progress bar
    function updateShippingProgress() {
        const subtotal = parseFloat(document.getElementById('subtotal').textContent);
        const progressBar = document.querySelector('.progress-fill');
        const freeShippingThreshold = 100;
        const progress = (subtotal / freeShippingThreshold) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
        
        const remaining = Math.max(0, freeShippingThreshold - subtotal);
        const progressText = document.getElementById('progress-text');
        if (remaining > 0) {
            progressText.textContent = `Plus que ${remaining.toFixed(2)} € pour la livraison gratuite !`;
        } else {
            progressText.textContent = 'Félicitations ! Vous bénéficiez de la livraison gratuite.';
        }
    }

    // Update delivery countdown timer
    function updateDeliveryTimer() {
        const now = new Date();
        const cutoffTime = new Date();
        cutoffTime.setHours(20, 0, 0, 0); // 20:00 cutoff time
        
        if (now > cutoffTime) {
            cutoffTime.setDate(cutoffTime.getDate() + 1);
        }
        
        const timeLeft = cutoffTime - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        const timerElement = document.querySelector('.delivery-timer');
        timerElement.textContent = `Commandez dans les ${hours}h ${minutes}m pour une livraison demain !`;
    }

    // Update totals
    function updateTotals() {
        let subtotal = 0;
        const items = document.querySelectorAll('.cart-item');
        
        items.forEach(item => {
            const price = parseFloat(item.querySelector('.price').textContent);
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const itemTotal = price * quantity;
            
            // Add warranty cost if selected
            const selectedWarranty = item.querySelector('.warranty-option input:checked');
            if (selectedWarranty) {
                const warrantyCost = parseFloat(selectedWarranty.dataset.cost);
                subtotal += warrantyCost;
            }
            
            item.querySelector('.item-total').textContent = itemTotal.toFixed(2) + ' €';
            subtotal += itemTotal;
        });

        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.20;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' €';
        document.getElementById('shipping').textContent = shipping === 0 ? 'Gratuite' : shipping.toFixed(2) + ' €';
        document.getElementById('tax').textContent = tax.toFixed(2) + ' €';
        document.getElementById('total').textContent = total.toFixed(2) + ' €';

        updateShippingProgress();
    }

    // Save for later functionality
    saveLaterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.cart-item');
            const savedItems = document.querySelector('.saved-items');
            
            // Create saved item element
            const savedItem = document.createElement('div');
            savedItem.className = 'saved-item';
            savedItem.innerHTML = `
                <img src="${item.querySelector('img').src}" alt="${item.querySelector('h3').textContent}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 1rem;">
                <div style="flex: 1;">
                    <h4>${item.querySelector('h3').textContent}</h4>
                    <p>${item.querySelector('.price').textContent}</p>
                </div>
                <button class="move-to-cart">Remettre au panier</button>
            `;
            
            savedItems.appendChild(savedItem);
            item.remove();
            updateTotals();
            
            // Show success message
            const message = document.createElement('div');
            message.className = 'success-message';
            message.textContent = 'Article sauvegardé pour plus tard';
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 3000);
        });
    });

    // Warranty selection
    warrantyOptions.forEach(option => {
        option.addEventListener('change', updateTotals);
    });

    // Quantity controls
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            updateTotals();
        });
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
            updateTotals();
        });
    });

    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                updateTotals();
            }
        });
    });

    // Remove items
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
                this.closest('.cart-item').remove();
                updateTotals();
                
                // Update cart count in header
                const remainingItems = document.querySelectorAll('.cart-item').length;
                document.querySelector('.cart-header h2').textContent = `Mon Panier (${remainingItems} articles)`;
                
                // Show empty cart message if no items remain
                if (remainingItems === 0) {
                    const cartContainer = document.querySelector('.cart-container');
                    cartContainer.innerHTML = `
                        <div class="empty-cart">
                            <h3>Votre panier est vide</h3>
                            <p>Découvrez nos produits et ajoutez-les à votre panier</p>
                            <a href="#" class="checkout-btn">Continuer mes achats</a>
                        </div>
                    `;
                }
            }
        });
    });

    // Add to cart functionality for suggested products
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.suggestion-item');
            const name = item.querySelector('h3').textContent;
            const price = parseFloat(item.querySelector('.price').textContent);
            
            // Animation feedback
            this.textContent = 'Ajouté !';
            this.style.backgroundColor = '#28a745';
            this.style.borderColor = '#28a745';
            this.style.color = '#fff';
            
            setTimeout(() => {
                this.textContent = 'Ajouter au panier';
                this.style.backgroundColor = '';
                this.style.borderColor = '#007bff';
                this.style.color = '#007bff';
            }, 2000);

            // Show success message
            const message = document.createElement('div');
            message.className = 'success-message';
            message.textContent = `${name} a été ajouté à votre panier`;
            message.style.position = 'fixed';
            message.style.top = '100px';
            message.style.right = '20px';
            message.style.backgroundColor = '#28a745';
            message.style.color = '#fff';
            message.style.padding = '1rem';
            message.style.borderRadius = '4px';
            message.style.zIndex = '1000';
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 3000);
        });
    });

    // Promo code
    promoButton.addEventListener('click', function() {
        const promoInput = document.getElementById('promo');
        const promoCode = promoInput.value.trim().toUpperCase();
        
        if (promoCode === 'WELCOME10') {
            const subtotal = parseFloat(document.getElementById('subtotal').textContent);
            const discount = subtotal * 0.1;
            alert('Code promo appliqué ! -10% sur votre commande');
            updateTotals();
        } else {
            alert('Code promo invalide');
        }
    });

    // Checkout
    checkoutButton.addEventListener('click', function() {
        alert('Redirection vers la page de paiement...');
    });

    // Initialize
    updateTotals();
    updateDeliveryTimer();
    setInterval(updateDeliveryTimer, 60000); // Update timer every minute
});