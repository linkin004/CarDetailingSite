// Car Detailing Website JavaScript

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add fade-in animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
});

// Package selection and pricing
const packages = {
    basic: {
        name: "Basic Clean",
        price: 49.99,
        description: "Exterior wash, interior vacuum, and basic detailing"
    },
    premium: {
        name: "Premium Detail",
        price: 89.99,
        description: "Complete interior and exterior detail with wax protection"
    },
    ultimate: {
        name: "Ultimate Package",
        price: 149.99,
        description: "Full service detail including paint correction and ceramic coating"
    },
    maintenance: {
        name: "Maintenance Wash",
        price: 29.99,
        description: "Quick exterior wash and interior tidy-up"
    }
};

// Update price display when package is selected
function updatePackagePrice() {
    const packageSelect = document.getElementById('package');
    const priceDisplay = document.getElementById('selected-price');
    
    if (packageSelect && priceDisplay) {
        const selectedPackage = packageSelect.value;
        if (selectedPackage && packages[selectedPackage]) {
            priceDisplay.textContent = `$${packages[selectedPackage].price}`;
            priceDisplay.style.opacity = '1';
        } else {
            priceDisplay.textContent = '';
            priceDisplay.style.opacity = '0';
        }
    }
}

// Form validation and submission
function validateScheduleForm() {
    const form = document.getElementById('schedule-form');
    if (!form) return false;

    const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'package'];
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const value = field.value.trim();
            if (!value) {
                field.style.borderColor = 'var(--danger)';
                if (!firstInvalidField) firstInvalidField = field;
                isValid = false;
            } else {
                field.style.borderColor = 'var(--highlight)';
            }
        }
    });

    // Email validation
    const email = document.getElementById('email');
    if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.style.borderColor = 'var(--danger)';
            if (!firstInvalidField) firstInvalidField = email;
            isValid = false;
        }
    }

    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && phone.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
            phone.style.borderColor = 'var(--danger)';
            if (!firstInvalidField) firstInvalidField = phone;
            isValid = false;
        }
    }

    // Date validation (must be in the future)
    const dateField = document.getElementById('date');
    if (dateField && dateField.value) {
        const selectedDate = new Date(dateField.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            dateField.style.borderColor = 'var(--danger)';
            if (!firstInvalidField) firstInvalidField = dateField;
            isValid = false;
        }
    }

    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        showNotification('Please fill in all required fields correctly.', 'error');
    }

    return isValid;
}

// Handle form submission
function handleScheduleSubmit(event) {
    event.preventDefault();
    
    if (validateScheduleForm()) {
        // In a real application, you would send this data to a server
        const formData = new FormData(event.target);
        const appointmentData = Object.fromEntries(formData.entries());
        
        console.log('Appointment scheduled:', appointmentData);
        
        showNotification('Appointment scheduled successfully! We will contact you shortly to confirm.', 'success');
        
        // Reset form
        event.target.reset();
        updatePackagePrice();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add notification styles if not already present
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 10px;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            .notification-success {
                background-color: var(--success);
            }
            .notification-error {
                background-color: var(--danger);
            }
            .notification-info {
                background-color: var(--primary-blue);
            }
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
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Date picker minimum date (today)
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// Initialize date picker when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    
    // Add event listeners
    const packageSelect = document.getElementById('package');
    if (packageSelect) {
        packageSelect.addEventListener('change', updatePackagePrice);
    }
    
    const scheduleForm = document.getElementById('schedule-form');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', handleScheduleSubmit);
    }
    
    // Clear field validation styling on input
    const formFields = document.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'var(--primary-blue)';
            }
        });
    });
});

// Mobile menu toggle (if needed for responsive design)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}
