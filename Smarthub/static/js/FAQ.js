// FAQ Data
const faqData = [
    // Commandes
    {
        id: 1,
        question: "Comment passer une commande sur notre site ?",
        answer: "Pour passer une commande sur notre site, vous ajoutez simplement vos produits au panier, cliquez sur 'Commander', renseignez vos informations de livraison et choisissez votre mode de paiement. Nous acceptons une multitude de moyens de paiements.",
        category: "commandes"
    },
    {
        id: 2,
        question: "Puis-je modifier ma commande après validation ?",
        answer: "Vous pouvez modifier votre commande dans les 30 minutes suivant la validation en nous contactant immédiatement. Passé ce délai, votre commande entre en préparation et ne peut plus être modifiée.",
        category: "commandes"
    },
    {
        id: 3,
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay et les virements bancaires. Tous les paiements sont sécurisés par cryptage SSL.",
        category: "commandes"
    },

    // Livraison
    {
        id: 4,
        question: "Quels sont vos délais de livraison ?",
        answer: "Livraison standard : 3-5 jours ouvrés. Livraison express : 24-48h. Livraison premium : le lendemain avant 13h. Les délais peuvent varier selon votre localisation et la disponibilité des produits.",
        category: "livraison"
    },
    {
        id: 5,
        question: "Livrez-vous à l'international ?",
        answer: "Oui, nous livrons dans plus de 50 pays. Les frais et délais de livraison internationale varient selon la destination. Consultez notre page dédiée pour plus d'informations sur votre pays.",
        category: "livraison"
    },
    {
        id: 6,
        question: "Comment suivre ma commande ?",
        answer: "Dès l'expédition, vous recevez un email avec le numéro de suivi. Vous pouvez aussi suivre votre commande depuis votre compte client en temps réel.",
        category: "livraison"
    },

    // Retours
    {
        id: 7,
        question: "Quelle est votre politique de retour ?",
        answer: "Vous disposez de 30 jours pour retourner tout produit. Les articles doivent être dans leur emballage d'origine, non utilisés. Le remboursement s'effectue sous 5-7 jours après réception du retour.",
        category: "retours"
    },
    {
        id: 8,
        question: "Comment retourner un produit défectueux ?",
        answer: "Contactez notre service client avec votre numéro de commande et des photos du défaut. Nous vous fournirons une étiquette de retour gratuite et traiterons votre demande en priorité.",
        category: "retours"
    },
    {
        id: 9,
        question: "Les frais de retour sont-ils gratuits ?",
        answer: "Les retours sont gratuits en cas de défaut ou d'erreur de notre part. Pour les retours de convenance, les frais sont à votre charge sauf pour les membres Premium.",
        category: "retours"
    },

    // Support technique
    {
        id: 10,
        question: "Comment configurer mon nouveau smartphone ?",
        answer: "Nous fournissons un guide de configuration détaillé avec chaque smartphone. Vous pouvez aussi contacter notre support technique 7j/7 ou regarder nos tutoriels vidéo sur notre chaîne YouTube.",
        category: "support"
    },
    {
        id: 11,
        question: "Que faire si mon produit ne fonctionne pas ?",
        answer: "Vérifiez d'abord notre section dépannage en ligne. Si le problème persiste, contactez notre support technique avec le modèle exact et la description du problème. Nous vous assisterons pas à pas.",
        category: "support"
    },
    {
        id: 12,
        question: "Proposez-vous une garantie étendue ?",
        answer: "Oui, nous proposons une garantie étendue de 2 ou 3 ans selon les produits. Elle couvre les pannes, la casse accidentelle et inclut un service de remplacement express.",
        category: "support"
    }
];

// Category icons mapping
const categoryIcons = {
    commandes: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 16h6v6h-6z"/>
        <path d="M8 8h6v6H8z"/>
        <path d="M2 2h6v6H2z"/>
    </svg>`,
    livraison: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
        <path d="M15 18H9"/>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
        <circle cx="17" cy="18" r="2"/>
        <circle cx="7" cy="18" r="2"/>
    </svg>`,
    retours: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
    </svg>`,
    support: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
    </svg>`
};

// Category display names
const categoryNames = {
    commandes: "Commandes",
    livraison: "Livraison", 
    retours: "Retours",
    support: "Support technique"
};

// State
let currentFilter = 'all';
let currentSearch = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const faqContainer = document.getElementById('faqContainer');
const noResults = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderFAQ();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', function(e) {
        currentSearch = e.target.value.toLowerCase();
        renderFAQ();
    });

    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            currentFilter = this.dataset.category;
            renderFAQ();
        });
    });
}

// Filter FAQ data
function getFilteredFAQ() {
    return faqData.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(currentSearch) ||
                             item.answer.toLowerCase().includes(currentSearch);
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        return matchesSearch && matchesCategory;
    });
}

// Render FAQ items
function renderFAQ() {
    const filteredData = getFilteredFAQ();
    
    if (filteredData.length === 0) {
        faqContainer.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    faqContainer.style.display = 'flex';
    noResults.style.display = 'none';
    
    faqContainer.innerHTML = filteredData.map(item => `
        <div class="faq-item" data-id="${item.id}">
            <button class="faq-question" onclick="toggleFAQ(${item.id})">
                <div class="question-content">
                    <div class="question-icon ${item.category}">
                        ${categoryIcons[item.category]}
                    </div>
                    <div class="question-text">
                        <h3>${item.question}</h3>
                        <span class="question-category">${categoryNames[item.category]}</span>
                    </div>
                </div>
                <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>
            <div class="faq-answer">
                <div class="answer-content">
                    <div class="answer-text">
                        ${item.answer}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle FAQ item
function toggleFAQ(id) {
    const faqItem = document.querySelector(`[data-id="${id}"]`);
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Toggle current item
    if (!isActive) {
        faqItem.classList.add('active');
    }
}