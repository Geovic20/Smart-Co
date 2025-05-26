// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Smooth scroll for hero button
const scrollIndicator = document.querySelector('.scroll-indicator');
const storySection = document.getElementById('story');

scrollIndicator.addEventListener('click', () => {
    storySection.scrollIntoView({ behavior: 'smooth' });
});

// Counter animation
const counters = document.querySelectorAll('.counter');
const counterSpeed = 200;

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    let count = 0;
    const increment = target / counterSpeed;
    
    const updateCount = () => {
        if (count < target) {
            count += increment;
            counter.textContent = Math.ceil(count) + '+';
            requestAnimationFrame(updateCount);
        } else {
            counter.textContent = target + '+';
        }
    };
    
    updateCount();
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            
            // Animate counter if it's a counter element
            if (entry.target.classList.contains('counter')) {
                animateCounter(entry.target);
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Testimonials slider
const testimonials = [
    {
        content: "ElectroTech has been my go-to electronics store for years. Their product knowledge and customer service are unmatched.",
        author: "John Michaels",
        role: "Technology Enthusiast",
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
    },
    {
        content: "Setting up my office technology was made simple with ElectroTech's business solutions team.",
        author: "Emma Wilson",
        role: "Small Business Owner",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
    },
    {
        content: "The specialized equipment I need for my photography business isn't easy to find, but ElectroTech always delivers.",
        author: "Raj Patel",
        role: "Professional Photographer",
        image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg"
    }
];

let currentTestimonial = 0;
const testimonialTrack = document.querySelector('.testimonials-track');
const prevBtn = document.querySelector('.testimonials-nav .prev');
const nextBtn = document.querySelector('.testimonials-nav .next');

const updateTestimonial = () => {
    const testimonial = testimonials[currentTestimonial];
    testimonialTrack.innerHTML = `
        <div class="testimonial-card">
            <div class="quote-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
            </div>
            <p class="testimonial-content">${testimonial.content}</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}">
                <div>
                    <h4>${testimonial.author}</h4>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        </div>
    `;
};

prevBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
});

nextBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
});

// Auto-advance testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
}, 5000);

// Initialize first testimonial
updateTestimonial();

