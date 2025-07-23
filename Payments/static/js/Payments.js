// Elements
const paymentMethods = document.querySelectorAll('.payment-method');
const paymentForms = document.querySelectorAll('.payment-form');
const submitButtons = document.querySelectorAll('.payment-form button[type="submit"]');
const paypalButton = document.querySelector('.btn-paypal');
const modal = document.getElementById('payment-success');
const closeModalButton = document.getElementById('close-modal');
const totalAmount = document.getElementById('total-amount').textContent;
const amountElements = document.querySelectorAll('.amount');
const successAmount = document.getElementById('success-amount');
const orderNumber = document.getElementById('order-number');

// Phone number patterns by provider
const phonePatterns = {
  mtn: /^01(42|46|50|51|52|53|54|56|57|59|61|62|66|67|69|90|91|92|93|96|97)\d{6}$/,  // MTN pattern
  moov: /^01(45|55|58|60|63|64|65|68|94|95|98|99)\d{6}$/,  // Moov pattern
  celtiis: /^01(40|41|43|44|47)\d{6}$/,  // Celtiis pattern
  orange: /^0[7][0-9]{6}$/,  // Orange pattern
  wave: /^0[7][0-9]{6}$/,   // Wave pattern
};

// Cryptocurrency conversion rates (example values)
const cryptoRates = {
  btc: 0.000023,  // 1 USD = 0.000023 BTC
  eth: 0.00041,   // 1 USD = 0.00041 ETH
  usdt: 1,        // 1 USD = 1 USDT
  bnb: 0.0027     // 1 USD = 0.0027 BNB
};

// Wallet addresses for each cryptocurrency
const walletAddresses = {
  btc: 'bc1p9r4s9uqfhwthpclga3t33xwjx8hqeemfvdc7uvlrk56v956py4vqzl4u5j',
  eth: '0xE83cbCED090e3075d67D84cb9C23a56c2CfF0aC3',
  usdt: '0xE83cbCED090e3075d67D84cb9C23a56c2CfF0aC3',
  bnb: '0xE83cbCED090e3075d67D84cb9C23a56c2CfF0aC3'
};

// Set amounts everywhere
amountElements.forEach(element => {
  element.textContent = totalAmount;
});
successAmount.textContent = totalAmount;

// Generate a random order number
function generateOrderNumber() {
  const prefix = 'TG-';
  const currentYear = new Date().getFullYear();
  const randomDigits = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${currentYear}${randomDigits}`;
}

// Set estimated delivery date
function setDeliveryDate() {
  const deliveryDate = document.getElementById('delivery-date');
  const date = new Date();
  date.setDate(date.getDate() + 14); // 14 days from now
  deliveryDate.textContent = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

orderNumber.textContent = generateOrderNumber();
setDeliveryDate();

// Initialize
function init() {
  // Hide all payment forms initially
  paymentForms.forEach(form => {
    form.classList.remove('active');
  });
  
  // Select the first payment method by default
  if (paymentMethods.length > 0) {
    selectPaymentMethod(paymentMethods[0]);
  }

  // Add event listener for cryptocurrency selection
  const cryptoSelect = document.getElementById('crypto-currency');
  if (cryptoSelect) {
    cryptoSelect.addEventListener('change', updateCryptoAmount);
  }
}

// Select payment method
function selectPaymentMethod(methodElement) {
  // Remove active class from all methods
  paymentMethods.forEach(method => {
    method.classList.remove('active');
  });
  
  // Add active class to selected method
  methodElement.classList.add('active');
  
  // Show corresponding form
  const methodType = methodElement.getAttribute('data-method');
  const formId = `${methodType}-form`;
  const form = document.getElementById(formId);
  
  // Hide all forms
  paymentForms.forEach(paymentForm => {
    paymentForm.classList.remove('active');
  });
  
  // Show selected form
  if (form) {
    form.classList.add('active');
  }

  // Update crypto amount if crypto method is selected
  if (methodType === 'crypto') {
    updateCryptoAmount();
  }
}

// Update cryptocurrency amount and address
function updateCryptoAmount() {
  const cryptoSelect = document.getElementById('crypto-currency');
  const amountElement = document.querySelector('.crypto-amount');
  const walletAddressElement = document.getElementById('wallet-address');
  const qrCodeElement = document.querySelector('.qr-code img');
  
  if (!cryptoSelect || !amountElement || !walletAddressElement) return;

  const selectedCrypto = cryptoSelect.value;
  if (!selectedCrypto) return;

  const usdAmount = parseFloat(totalAmount.replace('$', ''));
  const cryptoAmount = (usdAmount * cryptoRates[selectedCrypto]).toFixed(8);
  const walletAddress = walletAddresses[selectedCrypto];

  amountElement.textContent = `${cryptoAmount} ${selectedCrypto.toUpperCase()}`;
  walletAddressElement.textContent = walletAddress;
  qrCodeElement.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletAddress}`;
}

// Copy wallet address to clipboard
function copyWalletAddress() {
  const walletAddress = document.getElementById('wallet-address').textContent;
  navigator.clipboard.writeText(walletAddress).then(() => {
    const copyButton = document.querySelector('.btn-copy');
    const originalHTML = copyButton.innerHTML;
    copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(() => {
      copyButton.innerHTML = originalHTML;
    }, 2000);
  });
}

// Verify cryptocurrency transaction
function verifyTransaction() {
  const button = document.querySelector('#crypto-form button');
  button.textContent = 'Verifying...';
  button.disabled = true;

  // Simulate verification process
  setTimeout(() => {
    button.textContent = 'Verify Payment';
    button.disabled = false;
    showSuccessModal();
  }, 2000);
}

// Validate phone number
function validatePhoneNumber(phone, provider) {
  if (!phonePatterns[provider]) return true; // Skip validation if pattern not defined
  return phonePatterns[provider].test(phone);
}

// Validate credit card details
function validateCardDetails(card, expiry, cvv) {
  const cardPattern = /^[0-9]{16}$/;
  const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  const cvvPattern = /^[0-9]{3,4}$/;
  
  return {
    card: cardPattern.test(card.replace(/\s/g, '')),
    expiry: expiryPattern.test(expiry),
    cvv: cvvPattern.test(cvv)
  };
}

// Show error
function showError(input, message) {
  input.classList.add('error');
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
}

// Clear error
function clearError(input) {
  input.classList.remove('error');
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.classList.remove('visible');
  }
}

// Process payment
function processPayment(e) {
  e.preventDefault();
  
  const form = e.target.closest('form');
  if (!form) return;
  
  const paymentForm = form.closest('.payment-form');
  const paymentMethod = paymentForm.id.replace('-form', '');
  
  let isValid = true;
  
  // Validate based on payment method
  if (['mtn', 'moov', 'celtiis', 'orange', 'wave'].includes(paymentMethod)) {
    const phoneInput = form.querySelector('input[type="tel"]');
    const phoneNumber = phoneInput.value.trim();
    
    if (!validatePhoneNumber(phoneNumber, paymentMethod)) {
      showError(phoneInput, 'Veuillez entrer un numéro de téléphone valide');
      isValid = false;
    } else {
      clearError(phoneInput);
    }
  } else if (paymentMethod === 'fedapay') {
    const cardInput = form.querySelector('#fedapay-card');
    const expiryInput = form.querySelector('#fedapay-expiry');
    const cvvInput = form.querySelector('#fedapay-cvv');
    const nameInput = form.querySelector('#fedapay-name');
    
    const cardNumber = cardInput.value.trim().replace(/\s/g, '');
    const expiry = expiryInput.value.trim();
    const cvv = cvvInput.value.trim();
    const name = nameInput.value.trim();
    
    const cardValidation = validateCardDetails(cardNumber, expiry, cvv);
    
    if (!cardValidation.card) {
      showError(cardInput, 'Veuillez entrer un numéro de carte valide');
      isValid = false;
    } else {
      clearError(cardInput);
    }
    
    if (!cardValidation.expiry) {
      showError(expiryInput, 'Veuillez entrer une date d\'expiration valide (MM/YY)');
      isValid = false;
    } else {
      clearError(expiryInput);
    }
    
    if (!cardValidation.cvv) {
      showError(cvvInput, 'Veuillez entrer un code CVV valide');
      isValid = false;
    } else {
      clearError(cvvInput);
    }
    
    if (name.length < 3) {
      showError(nameInput, 'Veuillez entrer le nom du titulaire de la carte');
      isValid = false;
    } else {
      clearError(nameInput);
    }
  } else if (paymentMethod === 'bank') {
    const bankSelect = form.querySelector('#bank-name');
    const accountNumber = form.querySelector('#account-number');
    const accountName = form.querySelector('#account-name');
    
    if (bankSelect.value === '') {
      showError(bankSelect, 'Veuillez sélectionner votre banque');
      isValid = false;
    } else {
      clearError(bankSelect);
    }
    
    if (accountNumber.value.trim().length < 5) {
      showError(accountNumber, 'Veuillez entrer un numéro de compte valide');
      isValid = false;
    } else {
      clearError(accountNumber);
    }
    
    if (accountName.value.trim().length < 3) {
      showError(accountName, 'Veuillez entrer le nom du titulaire du compte');
      isValid = false;
    } else {
      clearError(accountName);
    }
  }
  
  // If form is valid, show success modal
  if (isValid) {
    // Simulate processing
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Traitement...';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      showSuccessModal();
    }, 1500);
  }
}

// Show success modal
function showSuccessModal() {
  modal.classList.add('active');
  document.querySelector('.progress-step.active').classList.add('complete');
  document.querySelector('.progress-step:last-child').classList.add('active');
}

// Close modal
function closeModal() {
  modal.classList.remove('active');
}

// Format card number with spaces
function formatCardNumber(input) {
  let value = input.value.replace(/\s/g, '');
  value = value.replace(/[^0-9]/g, '');
  
  let formattedValue = '';
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' ';
    }
    formattedValue += value[i];
  }
  
  input.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
}

// Format expiry date
function formatExpiryDate(input) {
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 2) {
    input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
  } else {
    input.value = value;
  }
}

// Event Listeners
paymentMethods.forEach(method => {
  method.addEventListener('click', () => {
    selectPaymentMethod(method);
  });
});

// Add input formatters
if (document.getElementById('fedapay-card')) {
  document.getElementById('fedapay-card').addEventListener('input', function() {
    formatCardNumber(this);
  });
}

if (document.getElementById('fedapay-expiry')) {
  document.getElementById('fedapay-expiry').addEventListener('input', function() {
    formatExpiryDate(this);
  });
}

// Form submissions
submitButtons.forEach(button => {
  button.addEventListener('click', processPayment);
});

// PayPal button
if (paypalButton) {
  paypalButton.addEventListener('click', () => {
    // Simulate PayPal redirect
    paypalButton.textContent = 'Redirecting to PayPal...';
    paypalButton.disabled = true;
    
    setTimeout(() => {
      paypalButton.textContent = 'Continue to PayPal';
      paypalButton.disabled = false;
      showSuccessModal();
    }, 1500);
  });
}

// Close modal
if (closeModalButton) {
  closeModalButton.addEventListener('click', closeModal);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', init);