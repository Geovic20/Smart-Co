const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

// Ouverture du menu responsive
if (bar) {
  bar.addEventListener('click', (event) => {
    event.stopPropagation();
    nav.classList.toggle('active');
  });
}

if (close) {
  close.addEventListener('click', () => {
    nav.classList.remove('active');
  });
}

// Fermeture du menu en cliquant à l'extérieur
document.addEventListener('click', (event) => {
  if (!nav.contains(event.target) && !bar.contains(event.target)) {
    nav.classList.remove('active');
  }
});

// Gestion du dropdown pour mobile et desktop
document.addEventListener("DOMContentLoaded", function () {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", function (e) {
      // Sur mobile, on veut que le clic fonctionne normalement
      if (window.innerWidth <= 799) {
        e.preventDefault();
        const parentDropdown = this.parentElement;
        parentDropdown.classList.toggle("active");

        // Fermer les autres dropdowns
        document.querySelectorAll(".dropdown").forEach(drop => {
          if (drop !== parentDropdown) drop.classList.remove("active");
        });
      }
      // Sur desktop, le comportement est géré par le CSS (:hover)
    });
  });

  // Fermer les dropdowns quand on clique ailleurs (pour mobile)
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 799) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('active');
        }
      });
    }
  });
});

// Gestion de la recherche mobile
const mobileSearchToggle = document.getElementById('mobile-search-toggle');
const searchBar = document.getElementById('search-bar');

if (mobileSearchToggle && searchBar) {
  mobileSearchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    searchBar.classList.toggle('active');

    // Focus sur l'input quand on ouvre
    if (searchBar.classList.contains('active')) {
      searchBar.querySelector('input').focus();
    }
  });

  // Fermer si on clique ailleurs
  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && !mobileSearchToggle.contains(e.target)) {
      searchBar.classList.remove('active');
    }
  });
}

//Animation du logo

//Découper chaque caractère dans un span
// Découper chaque caractère dans un span
const textWrapper = document.querySelector('#logo');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

function setupLogoAnimation() {
  const screenWidth = window.innerWidth;
  const isMobile = screenWidth <= 799; // Écrans de petite taille
  const isTabletOrDesktop = screenWidth >= 800;

  anime.remove('#logo .letter'); // Supprimer toute animation existante

  if (isTabletOrDesktop) {
    // Animation pour tablette et PC uniquement
    anime({
      targets: '#logo .letter',
      translateY: [
        { value: '-3vh', duration: 600, easing: 'easeOutExpo' },
        { value: '0vh', duration: 800, delay: 100, easing: 'easeOutBounce' }
      ],
      rotate: [
        { value: '-360deg', duration: 1000, easing: 'easeOutCirc' }
      ],
      delay: (el, i) => i * 50,
      loop: true,
      direction: 'alternate'
    });
  }
  // Sur mobile, aucune animation n'est appliquée
}

// Initialisation
setupLogoAnimation();

// Réexécuter à chaque redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  setupLogoAnimation();
});


//Script pour rétrécir légèrement la navbar dès le défilement
window.addEventListener('scroll', function () {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

