document.addEventListener('DOMContentLoaded', function() {
    // Profile picture hover effect
    const profilePicture = document.querySelector('.profile-picture-container');
    if (profilePicture) {
        profilePicture.addEventListener('mouseenter', function() {
            this.querySelector('.profile-picture').style.transform = 'scale(1.05)';
            this.querySelector('.profile-picture-overlay').style.opacity = '1';
        });
        
        profilePicture.addEventListener('mouseleave', function() {
            this.querySelector('.profile-picture').style.transform = 'scale(1)';
            this.querySelector('.profile-picture-overlay').style.opacity = '0';
        });
    }

    // Section Navigation
    const navLinks = document.querySelectorAll('.profile-nav a');
    const sections = document.querySelectorAll('.section-content');

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        } else {
            console.warn(`Section with id "${sectionId}-section" not found`);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Show default section (account)
    showSection('account');

    // Logout functionality
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // Implement logout logic here
            window.location.href = '/login';
        }
    });

    // Button click handlers
    document.getElementById('editInfoBtn')?.addEventListener('click', function() {
        alert('Edit Information functionality will be implemented here');
    });

    document.getElementById('editPreferencesBtn')?.addEventListener('click', function() {
        alert('Edit Preferences functionality will be implemented here');
    });

    document.getElementById('editAddressBtn')?.addEventListener('click', function() {
        alert('Edit Address functionality will be implemented here');
    });

    document.getElementById('changePasswordBtn')?.addEventListener('click', function() {
        alert('Change Password functionality will be implemented here');
    });

    // Order and Wishlist Interactions
    document.querySelectorAll('.order-history-item .btn')?.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('.order-history-item').querySelector('.order-number').textContent;
            alert(`Viewing details for ${orderId}`);
        });
    });

    document.querySelectorAll('.wishlist-item-actions .btn')?.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const itemName = this.closest('.wishlist-item').querySelector('h4').textContent;
            
            if (action === 'Add to Cart') {
                alert(`Adding ${itemName} to cart`);
            } else if (action === 'Remove') {
                if (confirm(`Remove ${itemName} from wishlist?`)) {
                    this.closest('.wishlist-item').remove();
                }
            }
        });
    });

    // Review Interactions
    document.querySelectorAll('.review-actions .btn')?.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            const reviewItem = this.closest('.review-item');
            const productName = reviewItem.querySelector('h4').textContent;
            
            if (action === 'Edit') {
                alert(`Editing review for ${productName}`);
            } else if (action === 'Delete') {
                if (confirm(`Delete review for ${productName}?`)) {
                    reviewItem.remove();
                }
            }
        });
    });

    // Animate profile cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.profile-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
});