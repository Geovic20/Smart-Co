// Configuration des méthodes de paiement
const paymentMethods = {
  mtn: {
      name: 'MTN Mobile Money',
      fields: [
        { type: 'tel', name: 'phone', label: 'Numéro de téléphone', placeholder: '01XXXXXXXX', required: true }
      ]
  },
  moov: {
      name: 'Moov Money',
      fields: [
        { type: 'tel', name: 'phone', label: 'Numéro de téléphone', placeholder: '01XXXXXXXX', required: true }
      ]
  },
  celtiis: {
      name: 'Celtiis Cash',
      fields: [
        { type: 'tel', name: 'phone', label: 'Numéro de téléphone', placeholder: '01XXXXXXXX', required: true }
      ]
  },
  orange: {
      name: 'Orange Money',
      fields: [
        { type: 'tel', name: 'phone', label: 'Numéro de téléphone', placeholder: '01XXXXXXXX', required: true }
      ]
  },
  wave: {
      name: 'Wave',
      fields: [
        { type: 'tel', name: 'phone', label: 'Numéro de téléphone', placeholder: '01XXXXXXXX', required: true }
      ]
  },
  crypto: {
      name: 'Crypto-monnaie',
      fields: [
          { 
            type: 'select', 
            name: 'currency', 
            label: 'Choisir la crypto-monnaie', 
            options: ['Bitcoin (BTC)', 'Ethereum (ETH)', 'USDT (TRC20)', 'USDT (ERC20)'], 
            required: true 
          },
          { type: 'text', name: 'wallet', label: 'Adresse de portefeuille', placeholder: 'Votre adresse wallet', required: true }
      ]
  },
  fedapay: {
      name: 'Fedapay',
      fields: [
        { type: 'email', name: 'email', label: 'Adresse email', placeholder: 'votre@email.com', required: true },
        { type: 'tel', name: 'phone', label: 'Numéro de téléphone', placeholder: '01XXXXXXXX', required: true }
      ]
  },
  paypal: {
      name: 'PayPal',
      fields: [
        { type: 'email', name: 'email', label: 'Adresse email PayPal', placeholder: 'votre@email.com', required: true }
      ]
  },
  card: {
      name: 'Compte bancaire',
      fields: [
        { type: 'text', name: 'cardNumber', label: 'Numéro de carte', placeholder: '1234 5678 9012 3456', required: true },
        { type: 'text', name: 'cardName', label: 'Nom sur la carte', placeholder: 'John Doe', required: true },
        { type: 'text', name: 'expiryDate', label: 'Date d\'expiration', placeholder: 'MM/AA', required: true, class: 'half' },
        { type: 'text', name: 'cvv', label: 'CVV', placeholder: '123', required: true, class: 'half' }
      ]
  }
};

// Variables globales
let selectedMethod = '';
let baseAmount = 299.99;
let deliveryFee = 0;
let totalAmount = baseAmount;
let deliveryInfo = {};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializeDeliveryForm();
  setupEventListeners();
  updateOrderTotal();
  console.log('DOM chargé, écouteurs configurés'); 
});

// Configuration du formulaire de livraison
function initializeDeliveryForm() {
  const deliveryForm = document.getElementById('livraison-form');
  if (!deliveryForm) {
        console.error('Formulaire de livraison non trouvé');
        return;
    }
  const quartierSelect = document.getElementById('quartier');
  const phoneInput = document.getElementById('phone');
  
  // Écouteur pour le changement de quartier
  quartierSelect.addEventListener('change', function() {
      const selectedOption = this.options[this.selectedIndex];
      const frais = selectedOption.getAttribute('data-frais');
      
      if (frais) {
        deliveryFee = parseInt(frais);
        document.getElementById('frais').textContent = deliveryFee;
        updateOrderTotal();
      } else {
        deliveryFee = 0;
        document.getElementById('frais').textContent = '0';
        updateOrderTotal();
      }
  });
  
  // Formatage du numéro de téléphone
  phoneInput.addEventListener('input', function() {
    formatPhoneNumber(this);
  });
  
  // Soumission du formulaire de livraison
  deliveryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateDeliveryForm()) {
          const paymentMode = document.querySelector('input[name="payment-mode"]:checked').value;
          
          // Sauvegarder les informations de livraison
          deliveryInfo = {
              quartier: document.getElementById('quartier').value,
              details: document.getElementById('details').value,
              phone: document.getElementById('phone').value,
              jour: document.getElementById('jour').value,
              heure: document.getElementById('heure').value,
              frais: deliveryFee,
              paymentMode: paymentMode
          };
          
          if (paymentMode === 'delivery') {
              // Paiement à la livraison - générer la facture
              generateInvoice();
          } else {
              // Passer à l'étape paiement en ligne
              showPaymentSection();
              updateProgressStep(3);
          }
      }
  });
  
  // Définir la date minimum à aujourd'hui
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('jour').setAttribute('min', today);
}

// Validation du formulaire de livraison
function validateDeliveryForm() {
  const quartier = document.getElementById('quartier').value;
  const details = document.getElementById('details').value;
  const phone = document.getElementById('phone').value;
  const jour = document.getElementById('jour').value;
  const heure = document.getElementById('heure').value;
  
  if (!quartier) {
    showNotification('Veuillez sélectionner un quartier', 'error');
    return false;
  }
  
  if (!details.trim()) {
    showNotification('Veuillez fournir les détails du lieu', 'error');
    return false;
  }
  
  if (!phone.trim()) {
    showNotification('Veuillez fournir un numéro de téléphone', 'error');
    return false;
  }
  
  if (!jour) {
    showNotification('Veuillez sélectionner un jour de livraison', 'error');
    return false;
  }
  
  if (!heure) {
    showNotification('Veuillez sélectionner une heure de livraison', 'error');
    return false;
  }
  return true;
}

// Génération de la facture pour paiement à la livraison
function generateInvoice() {
  const invoiceNumber = generateInvoiceNumber();
  
  // Remplir les informations de la facture
  document.getElementById('invoice-number').textContent = invoiceNumber;
  document.getElementById('client-phone').textContent = deliveryInfo.phone;
  document.getElementById('client-quartier').textContent = deliveryInfo.quartier;
  document.getElementById('client-address').textContent = deliveryInfo.details;
  document.getElementById('client-delivery-time').textContent = `${deliveryInfo.jour} à ${deliveryInfo.heure}`;
  document.getElementById('invoice-delivery-fee').textContent = `$${(deliveryFee / 655.957).toFixed(2)}`;
  document.getElementById('invoice-total').textContent = `$${(totalAmount / 655.957).toFixed(2)}`;
  
  // Afficher le modal de facture
  const invoiceModal = document.getElementById('invoice-modal');
  invoiceModal.classList.remove('hidden');
  
  // Mettre à jour l'étape de progression
  updateProgressStep(4);
}

// Génération d'un numéro de facture
function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `INV-${year}${month}${day}-${random}`;
}

// Fermeture du modal de facture
function closeInvoiceModal() {
  const modal = document.getElementById('invoice-modal');
  modal.classList.add('hidden');
}

// Afficher la section paiement
function showPaymentSection() {
  document.querySelector('.delivery-section').classList.add('hidden');
  document.querySelector('.payment-section').classList.remove('hidden');
  initializePaymentMethods();
}

// Mise à jour du total de la commande
function updateOrderTotal() {
  totalAmount = baseAmount + deliveryFee + tax;
  
  // Mettre à jour l'affichage de la livraison
  const deliveryRow = document.querySelector('.total-row:nth-child(2) span:last-child');
  if (deliveryRow) {
      deliveryRow.textContent = `$${(deliveryFee / 655.957).toFixed(2)}`;
  }
  
  // Mettre à jour le total
  const totalElement = document.getElementById('total-amount');
  if (totalElement) {
      totalElement.textContent = `$${(totalAmount / 655.957).toFixed(2)}`;
  }
  
  // Mettre à jour le montant de paiement
  const paymentAmount = document.getElementById('payment-amount');
  if (paymentAmount) {
      paymentAmount.textContent = `$${(totalAmount / 655.957).toFixed(2)}`;
  }
}

// Configuration des méthodes de paiement
function initializePaymentMethods() {
  const methods = document.querySelectorAll('.payment-method');
  
  methods.forEach(method => {
      method.addEventListener('click', function() {
          // Retirer la sélection précédente
          methods.forEach(m => m.classList.remove('selected'));
          
          // Ajouter la sélection actuelle
          this.classList.add('selected');
          
          const methodId = this.getAttribute('data-method');
          selectPaymentMethod(methodId);
      });
  });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
  // Formatage automatique pour les champs
  document.addEventListener('input', function(e) {
      if (e.target.name === 'phone') {
          formatPhoneNumber(e.target);
      } else if (e.target.name === 'cardNumber') {
          formatCardNumber(e.target);
      } else if (e.target.name === 'expiryDate') {
          formatExpiryDate(e.target);
      } else if (e.target.name === 'cvv') {
          formatCVV(e.target);
      }
  });
}

// Sélection d'une méthode de paiement
function selectPaymentMethod(methodId) {
  selectedMethod = methodId;
  
  // Mise à jour du titre
  const methodConfig = paymentMethods[methodId];
  document.getElementById('selected-method-title').textContent = methodConfig.name;
  
  // Génération du formulaire
  generatePaymentForm(methodConfig);
  
  // Affichage du formulaire
  const paymentForm = document.getElementById('payment-form');
  paymentForm.classList.remove('hidden');
  
  // Scroll vers le formulaire
  paymentForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Génération dynamique du formulaire
function generatePaymentForm(methodConfig) {
  const formContent = document.getElementById('form-content');
  let formHTML = '';
  
  let isInRow = false;
  
  methodConfig.fields.forEach((field, index) => {
      if (field.class === 'half') {
          if (!isInRow) {
              formHTML += '<div class="form-row">';
              isInRow = true;
          }
          formHTML += generateFormField(field);
          
          // Fermer la row si c'est le dernier champ ou si le prochain n'est pas half
          const nextField = methodConfig.fields[index + 1];
          if (!nextField || nextField.class !== 'half') {
              formHTML += '</div>';
              isInRow = false;
          }
      } else {
          if (isInRow) {
              formHTML += '</div>';
              isInRow = false;
          }
          formHTML += generateFormField(field);
      }
  });
  
  if (isInRow) {
    formHTML += '</div>';
  }
  
  formContent.innerHTML = formHTML;
}

// Génération d'un champ de formulaire
function generateFormField(field) {
  if (field.type === 'select') {
      let optionsHTML = '<option value="">Sélectionnez...</option>';
      field.options.forEach(option => {
          optionsHTML += `<option value="${option}">${option}</option>`;
      });
      
      return `
          <div class="form-group">
              <label class="form-label" for="${field.name}">${field.label}</label>
              <select name="${field.name}" id="${field.name}" class="form-input" ${field.required ? 'required' : ''}>
                  ${optionsHTML}
              </select>
          </div>
      `;
  } else {
      return `
          <div class="form-group">
              <label class="form-label" for="${field.name}">${field.label}</label>
              <input 
                  type="${field.type}" 
                  name="${field.name}" 
                  id="${field.name}" 
                  placeholder="${field.placeholder}" 
                  class="form-input" 
                  ${field.required ? 'required' : ''}
              >
          </div>
      `;
  }
}

// Formatage du numéro de téléphone
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 10) value = value.substring(0, 10);
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + ' ' + value.substring(2);
  }
  if (value.length >= 6) {
    value = value.substring(0, 6) + ' ' + value.substring(6);
  }
  if (value.length >= 9) {
    value = value.substring(0, 9) + ' ' + value.substring(9);
  }
  
  input.value = value;
}

// Formatage du numéro de carte
function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 16) value = value.substring(0, 16);
  
  value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
  input.value = value;
}

// Formatage de la date d'expiration
function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 4) value = value.substring(0, 4);
  
  if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
  }
  input.value = value;
}

// Formatage du CVV
function formatCVV(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 4) value = value.substring(0, 4);
  input.value = value;
}

// Validation du formulaire
function validateForm() {
  const requiredFields = document.querySelectorAll('#form-content [required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
      field.classList.remove('error', 'success');
      
      if (!field.value.trim()) {
          field.classList.add('error');
          isValid = false;
      } else {
          field.classList.add('success');
      }
  });
  return isValid;
}

// Traitement du paiement
function processPayment() {
    // Validation initiale
    if (!selectedMethod) {
        showNotification('Veuillez sélectionner une méthode de paiement', 'error');
        return;
    }
    
    if (!validateForm()) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    // Animation du bouton
    const payButton = document.querySelector('.pay-button');
    payButton.classList.add('loading');
    payButton.textContent = 'Traitement en cours...';
    payButton.disabled = true;
    
    // Préparer les données du formulaire
    const formData = new FormData(document.getElementById('payment-form'));
    formData.append('payment-method', selectedMethod); // Ajouter la méthode sélectionnée

    // Envoyer la requête au backend
    fetch('/payments/process/', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': getCookie('csrftoken') }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau ou serveur');
        }
        return response.json();
    })
    .then(data => {
        // Réponse du serveur
        if (data.status === 'success') {
            showPaymentSuccess(data.transaction_id, data.total_amount); // Ajuste si besoin
            updateProgressStep(3); // Passe à l'étape confirmation
        } else {
            throw new Error(data.message || 'Paiement échoué');
        }
    })
    .catch(error => {
        showNotification(error.message || 'Erreur lors du traitement du paiement.', 'error');
    })
    .finally(() => {
        // Restaurer le bouton
        payButton.classList.remove('loading');
        payButton.textContent = 'Confirmer le paiement';
        payButton.disabled = false;
    });
}

// Fonction utilitaire pour CSRF (si non présente)
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

// Affichage du succès du paiement
function showPaymentSuccess() {
  const transactionRef = generateTransactionRef();
  document.getElementById('transaction-ref').textContent = transactionRef;
  document.getElementById('final-amount').textContent = `$${(totalAmount / 655.957).toFixed(2)}`;
  document.getElementById('delivery-info').textContent = `${deliveryInfo.quartier} - ${deliveryInfo.jour} à ${deliveryInfo.heure}`;
  
  const modal = document.getElementById('success-modal');
  modal.classList.remove('hidden');
  
  // Mise à jour de l'étape de progression
  updateProgressStep(4);
}

// Téléchargement de la facture
function downloadInvoice() {
  // Simulation du téléchargement
  showNotification('Facture téléchargée avec succès !', 'success');
  
  // Dans une vraie application, vous pourriez générer un PDF
  // ou rediriger vers une URL de téléchargement
}

// Génération d'une référence de transaction
function generateTransactionRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TXN-';
  for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Mise à jour de l'étape de progression
function updateProgressStep(stepNumber) {
  const steps = document.querySelectorAll('.step');
  const lines = document.querySelectorAll('.step-line');
  
  steps.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index + 1 < stepNumber) {
          step.classList.add('completed');
      } else if (index + 1 === stepNumber) {
          step.classList.add('active');
      }
  });
  
  lines.forEach((line, index) => {
      if (index < stepNumber - 1) {
          line.classList.add('completed');
      } else {
          line.classList.remove('completed');
      }
  });
}

// Fermeture du modal
function closeModal() {
  const modal = document.getElementById('success-modal');
  modal.classList.add('hidden');
  
  // Redirection ou réinitialisation
  window.location.href = '/boutique'; // Ou réinitialiser le formulaire
}

// Affichage des notifications
function showNotification(message, type = 'info') {
  // Supprimer les notifications existantes
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
      existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const colors = {
    success: 'background: #c6f6d5; color: #22543d; border-left: 4px solid #38a169;',
    error: 'background: #fed7d7; color: #c53030; border-left: 4px solid #e53e3e;',
    info: 'background: #bee3f8; color: #2a69ac; border-left: 4px solid #3182ce;'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
    ${colors[type]}
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Supprimer après 5 secondes
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Ajout des styles d'animation pour les notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
  }
  
  @keyframes slideOut {
      from {
          transform: translateX(0);
          opacity: 1;
      }
      to {
          transform: translateX(100%);
          opacity: 0;
      }
  }
`;
document.head.appendChild(style);