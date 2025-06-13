// FAQ Data
const faqData = [
    // Commandes
    {
        id: 1,
        question: "Comment passer une commande sur votre site ?",
        answer: "Il vous suffit de sélectionner un produit, de cliquer sur 'Ajouter au panier', puis de valider votre commande en suivant les étapes de paiement.",
        category: "commandes"
    },
    {
        id: 2,
        question: "Puis-je modifier ma commande après validation ?",
        answer: "Oui, vous pouvez modifier votre commande dans les 30 minutes suivant la validation en nous contactant immédiatement via le support. Passé ce délai, votre commande entre en préparation et ne peut plus être modifiée.",
        category: "commandes"
    },
    {
        id: 3,
        question: "Comment suivre ma commande ?",
        answer: "Une fois votre commande expédiée, vous recevrez un lien de suivi par e-mail ou dans votre espace client. Vous pouvez suivre l'état de votre livraison en temps réel.",
        category: "commandes"
    },
    {
        id: 4,
        question: "Que faire si j’ai commandé le mauvais article ?",
        answer: "Contactez notre service client dans les plus brefs délais pour annuler ou modifier votre commande avant son expédition.",
        category: "commandes"
    },
    {
        id: 5,
        question: "Est-ce que je peux commander sans créer de compte ?",
        answer: "Non, pour des raisons de sécurité et de suivi, un compte est nécessaire pour passer commande. Vous pouvez créer un compte rapidement lors de votre première commande.",
        category: "commandes"
    },
    {
        id: 6,
        question: "Puis-je commander en dehors du Bénin ?",
        answer: "Non, pour le moment, nous ne livrons qu'au Bénin. Nous prévoyons d'étendre nos services à d'autres pays dans un avenir très proche. Abonnez-vous à notre newsletter pour être informé des prochaines livraisons internationales.",
        category: "commandes"
    },

    // Paiements
    {
        id: 7,
        question: "Quels modes de paiement acceptez-vous ?",
        answer: "Nous acceptons les paiements par carte bancaire, mobile money (MTN, Moov), virement bancaire et espèces à la livraison. Tous les paiements sont sécurisés.",
        category: "paiements"
    },
    {
        id: 8,
        question: "Est-ce que le paiement est sécurisé ?",
        answer: "Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos informations de paiement. Toutes les transactions sont cryptées et sécurisées.",
        category: "paiements"
    },
    {
        id: 9,
        question: "Puis-je payer en plusieurs fois ?",
        answer: "Oui, nous proposons un paiement en plusieurs fois sans frais supplémentaires pour les commandes supérieures à 100 000 FCFA. Contactez notre service client pour plus de détails.",
        category: "paiements"
    },
    {
        id: 10,
        question:"Puis-je payer à la livraison ?",
        answer: "Oui, le paiement à la livraison est disponible dans certaines zones. Vérifiez la disponibilité lors de la commande. Si vous choisissez cette option, assurez-vous d'avoir le montant exact en espèces.",
        category: "paiements"
    },
    {
        id: 11,
        question: "Que faire si mon paiement échoue ?",
        answer: "Si votre paiement échoue, vérifiez vos informations de carte ou de compte. Si le problème persiste, essayez un autre mode de paiement ou contactez votre banque. Vous pouvez aussi nous contacter pour assistance.",
        category: "paiements"
    },
    {
        id:12,
        question: "Proposez-vous des réductions pour les paiements en ligne ?",
        answer: "Oui, nous offrons une réduction de 5% pour les paiements effectués en ligne. Cette offre est valable pour toutes les commandes supérieures à 50 000 FCFA. Utilisez le code promo 'ONLINE5' lors du paiement.",
        category: "paiements"
    },
    {
        id: 13,
        question: "Proposez-vous des facilités de paiement ?",
        answer: "Oui, nous proposons dans certains cas des facilités de paiement en plusieurs fois sans frais pour les commandes supérieures à 100 000 FCFA, ou des paiements échelonnés. Contactez-nous pour plus d'informations.",
        category: "paiements"
    },
    {
        id: 14,
        question: "Puis-je utiliser des cartes prépayées ?",
        answer: "Oui, nous acceptons les cartes prépayées Visa et Mastercard. Assurez-vous que votre carte est activée pour les paiements en ligne.",
        category: "paiements"
    },
    {
        id: 15,
        question: "Comment obtenir une facture pour ma commande ?",
        answer: "Une facture est automatiquement générée et envoyée par email après validation de votre commande. Vous pouvez aussi la télécharger depuis votre compte client dans la section 'Mes commandes'.",
        category: "paiements"
    },

    // Livraison
    {
        id: 16,
        question: "Quels sont vos délais de livraison ?",
        answer: "Les livraisons standard prennent entre 12h et 48h au Bénin selon la localité. Les livraisons express ou premium se font en moins de 10h de temps. Les délais peuvent varier selon votre localisation et la disponibilité des produits.",
        category: "livraison"
    },
    {
        id: 17,
        question: "Livrez-vous dans tout le Bénin ?",
        answer: "Oui, nous livrons partout au Bénin, y compris les zones rurales. Nous avons des partenariats avec des transporteurs locaux pour assurer une livraison rapide et fiable.",
        category: "livraison"
    },
    {
        id: 18,
        question: "Quels sont les frais de livraison ?",
        answer: "Les frais varient selon votre localisation. Ils sont indiqués avant la validation de votre commande. Pour les commandes supérieures à 100 000 FCFA, la livraison est gratuite dans la plupart des zones urbaines.",
        category: "livraison"
    },
    {
        id: 19,
        question: "Puis-je choisir l'heure de livraison ?",
        answer: "Oui, lors de la validation de votre commande, vous pouvez choisir une plage horaire de livraison. Nous ferons de notre mieux pour respecter vos préférences.",
        category: "livraison"
    },
    {
        id: 20,
        question: " Puis-je changer l’adresse de livraison après commande ?",
        answer: "Oui, tant que la commande n’a pas été expédiée. Contactez-nous rapidement pour effectuer ce changement. Si la commande est déjà en cours de livraison, nous ne pourrons pas modifier l'adresse.",
        category: "livraison"
    },
    {
        id: 21,
        question: "Que faire si je ne reçois pas ma commande ?",
        answer: "Vérifiez le suivi et contactez notre service client. Nous ferons une enquête et vous proposerons une solution. Si la commande est perdue, nous vous rembourserons ou vous renverrons le produit.",
        category: "livraison"
    },
    {
        id: 22,
        question: "Proposez-vous une livraison express ?",
        answer: "Oui, nous proposons une option de livraison express pour les commandes urgentes. Elle garantit une livraison en moins de 10 heures dans les zones éligibles.",
        category: "livraison"
    },
    {
        id: 23,
        question: "Puis-je choisir un point de relais ou lieu de retrait ?",
        answer: "Oui, nous avons des points de relais dans pcertaines villes. Vous pouvez sélectionner un point de retrait lors de la validation de votre commande. Cela peut être pratique si vous n'êtes pas chez vous au moment de la livraison.",
        category: "livraison"
    },

    // Retours
    {
        id: 24,
        question: "Quelle est votre politique de retour ?",
        answer: "Vous disposez de 24 heures pour retourner tout produit. Les articles doivent être dans leur emballage d'origine, non utilisés. Le remboursement s'effectue sous 5-7 jours après réception du retour.",
        category: "retours"
    },
    {
        id: 25,
        question: "Comment retourner un produit défectueux ?",
        answer: "Contactez notre service client avec votre numéro de commande et des photos du défaut. Nous vous fournirons une étiquette de retour gratuite et traiterons votre demande en priorité.",
        category: "retours"
    },
    {
        id: 26,
        question: "Les frais de retour sont-ils gratuits ?",
        answer: "Les retours sont gratuits en cas de défaut ou d'erreur de notre part. Pour les retours de convenance, les frais sont à votre charge. Nous vous recommandons d'utiliser un service de suivi pour les retours.",
        category: "retours"
    },
    {
        id: 27,
        question: "Puis-je échanger un produit ?",
        answer: "Oui, les échanges sont possibles dans les 24 heures suivant la réception. Contactez notre service client pour initier l'échange. Les produits doivent être dans leur emballage d'origine et non utilisés.",
        category: "retours"
    },
    {
        id: 28,
        question: "Quels produits ne peuvent pas être retournés ?",
        answer: "Les produits personnalisés, les produits endommagés et les articles en promotion ne sont pas éligibles au retour. Veuillez vérifier la description du produit avant l'achat.",
        category: "retours"
    },

    // Support technique
    {
        id: 29,
        question: "Comment configurer un produit acheté ?",
        answer: "Chaque produit est livré avec un guide d’utilisation. Vous pouvez aussi consulter nos tutoriels en ligne ou vous pouvez aussi contacter notre support technique 7j/7 . Nous vous aiderons à configurer votre produit pas à pas.",
        category: "support"
    },
    {
        id: 30,
        question: "Que faire si mon produit ne fonctionne pas ?",
        answer: "Vérifiez la notice. Si le problème persiste, contactez notre service technique pour assistance ou remplacement.",
        category: "support"
    },
    {
        id: 31,
        question: "Proposez-vous une garantie étendue ?",
        answer: "Oui, nous proposons une garantie étendue de 3 à 12 mois selon les produits et les fabricants. Elle couvre les pannes, la casse accidentelle et inclut un service de remplacement express.",
        category: "support"
    },
    {
        id: 32,
        question: "Comment contacter le support technique ?",
        answer: "Vous pouvez nous contacter par e-mail, téléphone ou via notre chat en ligne. Notre équipe est disponible 7j/7 pour vous aider avec vos questions techniques.",
        category: "support"
    },
    {
        id: 33,
        question: "Puis-je obternir un service après vente ?",
        answer: "Oui, notre équipe technique est disponible pour répondre à vos besoins après l’achat. Nous offrons un service après-vente complet, y compris des réparations, des remplacements et des conseils d'utilisation.",
        category: "support"
    },
    {
        id: 34,
        question: "Comment signaler un bug sur votre site ?",
        answer: "Si vous rencontrez un bug, veuillez nous envoyer un e-mail détaillant le problème. Nous ferons de notre mieux pour le résoudre rapidement.",
        category: "support"
    },
    {
        id: 35,
        question: "Comment signaler un produit défectueux à la livraison ?",
        answer: "Si vous recevez un produit défectueux, veuillez prendre une photo du produit et nous contacter dans les 2 heures suivant la livraison. Nous organiserons un retour et un remplacement ou un remboursement selon votre préférence.",
        category: "support"
    }

    //Sécurité & compte
    ,{
        id: 36,
        question: "Comment protéger mon compte ?",
        answer: "Utilisez un mot de passe fort, changez-le régulièrement et activez la double authentification pour plus de sécurité. Ne partagez jamais vos identifiants avec qui que ce soit.",
        category: "sécurité"
    },
    {
        id: 37,
        question: "Que faire si j'oublie mon mot de passe ?",
        answer: "Utilisez la fonction 'Mot de passe oublié' sur la page de connexion pour réinitialiser votre mot de passe. Vous recevrez un e-mail avec les instructions pour le réinitialiser.",
        category: "sécurité"
    },
    {
        id: 38,
        question: "Comment signaler une activité suspecte sur mon compte ?",
        answer: "Si vous remarquez une activité suspecte, changez immédiatement votre mot de passe et contactez notre support technique. Nous enquêterons sur l'incident et prendrons les mesures nécessaires.",
        category: "sécurité"
    },
    {
        id: 39,
        question: "Vos données sont-elles sécurisées ?",
        answer: "Oui, nous utilisons des protocoles de sécurité avancés pour protéger vos données personnelles. Toutes les transactions sont cryptées et stockées en toute sécurité.",
        category: "sécurité"
    },
    {
        id: 40,
        question: "Comment supprimer mon compte ?",
        answer: "Pour supprimer votre compte, veuillez nous contacter via le support client. Nous traiterons votre demande dans les plus brefs délais.",
        category: "sécurité"
    },

    //Autres questions
    {
        id: 41,
        question: "Comment puis-je vous contacter ?",
        answer: "Vous pouvez nous contacter par e-mail, téléphone ou via notre chat en ligne. Nos coordonnées sont disponibles sur la page 'Contactez-nous'.",
        category: "autres"
    },
    {
        id: 42,
        question: "Avez-vous une application mobile ?",
        answer: "Nous y travaillons ! Suivez-nous sur nos réseaux sociaux pour être informé du lancement. Nous prévoyons de lancer notre application mobile dans les prochains mois pour faciliter vos achats.",
        category: "autres"
    },
    {
        id: 43,
        question: "Proposez-vous des réductions pour les étudiants ?",
        answer: "Pour le moment, nous ne proposons pas de réductions spécifiques pour les étudiants. Cependant, nous avons régulièrement des promotions et des offres spéciales. Abonnez-vous à notre newsletter pour être informé des dernières offres.",
        category: "autres"
    },
    {
        id: 44,
        question: "Comment suivre vos actualités et promotions ?",
        answer: "Abonnez-vous à notre newsletter et suivez-nous sur les réseaux sociaux pour être informé de nos dernières offres et actualités.",
        category: "autres"
    },
    {
        id: 45,
        question: "Proposez-vous un programme de fidélité ?",
        answer: "Oui, nous avons un programme de fidélité qui vous permet de gagner des points à chaque achat. Ces points peuvent être échangés contre des réductions ou des cadeaux.",
        category: "autres"
    }
];

// Category icons mapping
const categoryIcons = {
    commandes: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M16 16h6v6h-6z"/>
        <path d="M8 8h6v6H8z"/>
        <path d="M2 2h6v6H2z"/>
    </svg>`,
    paiements:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
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
    </svg>`,
    sécurité: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`,
    autres: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8Z"/>
        <path d="M12.5 7h-1a1.5 1.5 0 0 0-1.5 1.5v4A1.5 1.5 0 0 0 11.5 14h1a1.5 1.5 0 0 0 .5-2.9V9A1.5 1.5 0 0 0 12.5 7Z"/>
        <circle cx="12" cy="17" r="1"/>
    </svg>`
};

// Category display names
const categoryNames = {
    commandes: "Commandes",
    livraison: "Livraison", 
    retours: "Retours",
    support: "Support technique",
    paiements: "Paiements",
    sécurité: "Sécurité & compte",
    autres: "Autres questions"
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