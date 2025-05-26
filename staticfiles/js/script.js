const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

//Ouverture du menu responsive
if (bar) {
    bar.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche l'événement de se propager au document
        nav.classList.toggle('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !bar.contains(event.target)) {
        nav.classList.remove('active');
    }
});