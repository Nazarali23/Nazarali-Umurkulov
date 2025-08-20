
document.addEventListener('DOMContentLoaded', function () {

    // Tüm sayfalarda çalışması gereken ortak işlevsellikler
    initThemeToggle();
    initLanguageSelector();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initFloatingShapes();
    // Sayfaya özel işlevsellikleri kontrol et ve sadece varsa başlat

    // Smooth Scroll (Tüm sayfalar için geçerli olabilir)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // Projeler Sayfası (projects.html) için özgü işlev
    const isProjectsPage = document.querySelector('.project-gallery') !== null;
    if (isProjectsPage) {
        initProjectGallery();
    }

    // Sertifikalar Sayfası (certificates.html) için özgü işlev
    const isCertificatesPage = document.querySelector('.certificates-grid') !== null;
    if (isCertificatesPage) {
        initCertificateHandlers();
    }
});

// Doğum tarihinizi girin (yıl, ay-1, gün)
const birthDate = new Date(2004, 4, 23); // Örnek: 15 Ocak 2003

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Eğer doğum günü bu yıl henüz gelmediyse yaşı 1 azalt
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
}

const myAge = calculateAge(birthDate);
console.log(`Current age: ${myAge}`);

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    // Always start with light theme (reset on each session)
    const savedTheme = 'light'; // Force reset to light theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    icon.className = 'fas fa-moon';
    themeToggle.title = 'Switch to Dark Mode';

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);

        // Update icon and title
        if (newTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Switch to Dark Mode';
        }

        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

        // Show theme change notification
        showNotification(`Switched to ${newTheme} theme!`, 'info');
    });
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar background on scroll (rAF-coalesced)
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (navTicking) return;
        navTicking = true;
        requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.background = 'rgba(15, 23, 42, 0.98)';
                } else {
                    navbar.style.background = 'rgba(250, 250, 250, 0.98)';
                }
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                } else {
                    navbar.style.background = 'rgba(250, 250, 250, 0.95)';
                }
                navbar.style.boxShadow = 'none';
            }
            navTicking = false;
        });
    }, { passive: true });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');

                // Reset hamburger lines
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (hamburger && navMenu &&
            !hamburger.contains(e.target) &&
            !navMenu.contains(e.target) &&
            navMenu.classList.contains('active')) {

            hamburger.classList.remove('active');
            navMenu.classList.remove('active');

            // Reset hamburger lines
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for skill bars
                if (entry.target.classList.contains('skill-progress')) {
                    const level = entry.target.getAttribute('data-level');
                    entry.target.style.width = level + '%';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .skill-progress').forEach(el => {
        observer.observe(el);
    });

    // Add animation classes to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.setProperty('--level', level + '%');
    });
}

// Project gallery functionality
function initProjectGallery() {
    const modal = document.getElementById('projectModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageCounter = document.getElementById('imageCounter');

    // Get all gallery images
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    let currentImageIndex = 0;

    // Function to update modal image
    function updateModalImage(index) {
        currentImageIndex = index;
        modalImg.src = galleryImages[index].src;
        imageCounter.textContent = `${index + 1} / ${galleryImages.length}`;

        // Update button states
        prevBtn.style.display = index === 0 ? 'none' : 'flex';
        nextBtn.style.display = index === galleryImages.length - 1 ? 'none' : 'flex';
    }

    // Open modal when clicking on gallery items
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            updateModalImage(index);
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
            updateModalImage(newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
            updateModalImage(newIndex);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
                updateModalImage(newIndex);
            } else if (e.key === 'ArrowRight') {
                const newIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
                updateModalImage(newIndex);
            }
        }
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Certificate handlers
function initCertificateHandlers() {
    const certificateModal = document.getElementById('certificateModal');
    const certificateFrame = document.getElementById('certificateFrame');
    const closeModal = certificateModal.querySelector('.close-modal');

    document.querySelectorAll('.certificate-card').forEach(card => {
        card.addEventListener('click', () => {
            const pdfPath = card.getAttribute('data-pdf');
            if (pdfPath) {
                certificateFrame.src = pdfPath;
                certificateModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close certificate modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            certificateModal.style.display = 'none';
            certificateFrame.src = '';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    certificateModal.addEventListener('click', (e) => {
        if (e.target === certificateModal) {
            certificateModal.style.display = 'none';
            certificateFrame.src = '';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certificateModal.style.display === 'block') {
            certificateModal.style.display = 'none';
            certificateFrame.src = '';
            document.body.style.overflow = 'auto';
        }
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('input[type="text"]').value;
            const message = form.querySelector('textarea').value;

            if (!name || !message) {
                alert('Please fill in all fields');
                return;
            }

            // mailto link oluştur
            const subject = encodeURIComponent("Yeni İletişim Mesajı");
            const body = encodeURIComponent(
                `Ad: ${name}\nMesaj:\n${message}`
            );

            // Kullanıcının varsayılan mail uygulamasını aç
            window.location.href = `mailto:nazaraliumirkulow@gmail.com?subject=${subject}&body=${body}`;
        });
    }
}


// Floating shapes animation
function initFloatingShapes() {
    const shapes = document.querySelectorAll('.shape');

    // rAF-coalesced parallax for shapes
    let shapesTicking = false;
    window.addEventListener('scroll', () => {
        if (shapesTicking) return;
        shapesTicking = true;
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
            shapesTicking = false;
        });
    }, { passive: true });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth reveal animations for sections
function revealOnScroll() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        if (scrollY + windowHeight > sectionTop + sectionHeight * 0.3) {
            section.classList.add('revealed');
        }
    });
}


// Parallax effect for hero section
function parallaxHero() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// (Removed unthrottled parallax listener; throttled one is attached below)
// window.addEventListener('scroll', parallaxHero);

// Typing effect for hero title
function initTypingEffect() {
    const titleMain = document.querySelector('.title-main');
    if (!titleMain) return;

    const text = titleMain.textContent;
    titleMain.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            titleMain.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// Initialize typing effect
setTimeout(initTypingEffect, 500);

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .notification-message {
        flex: 1;
    }
`;

document.head.appendChild(notificationStyles);

// Add CSS for revealed sections
const revealStyles = document.createElement('style');
revealStyles.textContent = `
    section {
        opacity: 1;
        transform: none;
        transition: all 0.8s ease-out;
    }
    
    section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    section:first-child {
        opacity: 1;
        transform: none;
    }
`;

document.head.appendChild(revealStyles);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledRevealOnScroll = throttle(revealOnScroll, 100);
const throttledParallaxHero = throttle(parallaxHero, 16);

window.addEventListener('scroll', throttledRevealOnScroll, { passive: true });
window.addEventListener('scroll', throttledParallaxHero, { passive: true });

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Add CSS for loading state
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        body:not(.loaded) {
            overflow: hidden;
        }
        
        body:not(.loaded)::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        body:not(.loaded)::after {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            z-index: 10000;
        }
        
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;

    document.head.appendChild(loadingStyles);
});

// Add smooth hover effects for interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        btn.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.certificate-card, .hobby-card, .project-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add cursor trail effect
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.opacity = '0.6';
    }, { passive: true });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.1;
        cursorY += dy * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '0.6';
    });
}

// Initialize cursor trail on desktop only
if (window.innerWidth > 768) {
    initCursorTrail();
}
// Three.js ve GLTFLoader CDN eklenmiş olmalı

// Language translations
const translations = {
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-projects': 'Projects',
        'nav-skills': 'Skills',
        'nav-certificates': 'Certificates',
        'nav-hobbies': 'Hobbies',
        'nav-contact': 'Contact',
        'word-engineering': 'I\'m',

        // Hero Section
        'word-compute': 'Hell',
        'hero-title': 'Your Name',
        'hero-subtitle': 'Computer Engineering Student',
        'hero-description': '3rd-year Computer Engineering student at Tokat Gaziosmanpaşa University, passionate about creating innovative solutions and pushing the boundaries of technology.',
        'btn-download-cv': 'Download CV',
        'letter-o': 'o',

        // About Section
        'about-title': 'About Me',
        'about-role': 'Mobile & Desktop Application Developer',
        'about-description': `I am Nazarali Umurkulov, 21 years old, and a citizen of Turkmenistan. I am currently studying Computer Engineering in Turkey.<br>I am passionate about software development, algorithm design, and artificial intelligence applications. My focus is on creating efficient solutions in mobile and web projects while prioritizing user experience. I also have been working on projects involving data processing, automation, and smart planning systems.`,
        'about-mobile': 'Mobile Development',
        'about-desktop': 'Desktop Applications',
        'about-3d': '3D Modeling',
        'about-games': 'Game Development',

        // Projects Section
        'projects-title': 'Featured Projects',
        'project-planner-ai': 'Planner AI',
        'project-planner-description': 'An AI-powered planner and reminder mobile app with futuristic UI and smart agent features.',
        'project-tech-flutter': 'Flutter',
        'project-tech-ai': 'AI',
        'project-tech-mobile': 'Mobile',

        // Skills Section
        'skills-title': 'Technical Skills',
        'skills-programming': 'Programming Languages',
        'skills-languages': 'Language Skills',
        'skills-specialized': 'Specialized Skills',
        'skills-3d-modeling': '3D Modeling (Blender)',
        'skills-ui-ux': 'UI/UX Design',
        'skills-game-dev': 'Game Development',
        'skills-ai': 'Artificial Intelligence',

        // Programming Skills
        'skill-flutter': 'Flutter',
        'skill-html-css': 'HTML/CSS',
        'skill-csharp': 'C#',
        'skill-java': 'Java',
        'skill-python': 'Python',
        'skill-pascal': 'Pascal',

        // Language Skills
        'lang-english': 'English',
        'lang-turkish': 'Turkish',
        'lang-turkmen': 'Turkmen',
        'lang-russian': 'Russian',
        'lang-level-b2': 'B2 - Upper Intermediate',
        'lang-level-c1': 'C1 - Advanced',
        'lang-level-c2': 'C2 - Native',
        'lang-level-a1': 'A1 - Beginner',

        // Certificates Section
        'certificates-title': 'Certificates & Achievements',
        'cert-llm': 'LLM Workshop',
        'cert-llm-desc': 'Generative AI & LLM Workshop Certificate',
        'cert-python': 'Python Programming',
        'cert-python-desc': 'Python Programming Training Certificate',
        'cert-gpt': 'Personalized GPTs',
        'cert-gpt-desc': 'Custom GPT Development Certificate',
        'cert-ai-intro': 'AI Introduction',
        'cert-ai-intro-desc': 'Artificial Intelligence Basics Certificate',
        'cert-python-adv': 'Python Training',
        'cert-python-adv-desc': 'Advanced Python Programming Certificate',
        'cert-general': 'General Certificate',
        'cert-general-desc': 'Professional Development Certificate',
        'cert-csharp': 'C# Programming',
        'cert-csharp-desc': 'C# Programming Certificate',
        'cert-java': 'Java Programming',
        'cert-java-desc': 'Java Programming Certificate',
        'cert-cpp': 'C++ Programming',
        'cert-cpp-desc': 'C++ Programming Certificate',
        'cert-photography': 'Photography',
        'cert-photography-desc': 'Basic Photography Certificate',
        'cert-web': 'Web Literacy',
        'cert-web-desc': 'Web Literacy Certificate',
        'cert-office': 'Office Applications',
        'cert-office-desc': 'Document Management & Office Apps',
        'cert-tech': 'Tech Innovation',
        'cert-tech-desc': 'Technology Innovation & Entrepreneurship',
        'cert-comm': 'Communication Tech',
        'cert-comm-desc': 'New Communication Technologies',
        'cert-system': 'System Analysis',
        'cert-system-desc': 'System Analysis & Design Certificate',

        // Hobbies Section
        'hobbies-title': 'Hobbies & Interests',
        'hobby-photography': 'Photography',
        'hobby-photography-desc': 'Capturing moments and exploring the world through the lens',
        'hobby-painting': 'Painting',
        'hobby-painting-desc': 'Expressing creativity through colors and brushstrokes',
        'hobby-game-dev': 'Game Development',
        'hobby-game-dev-desc': 'Creating immersive worlds and interactive experiences',

        // Contact Section
        'contact-title': 'Get In Touch',
        'contact-lets-connect': 'Let\'s Connect',
        'contact-description': 'I\'m always open to discussing new opportunities, interesting projects, or just having a chat about technology and innovation.',
        'contact-name-placeholder': 'Your Name',
        'contact-email-placeholder': 'Your Email',
        'contact-message-placeholder': 'Your Message',
        'btn-send-message': 'Send Message',

        // Footer
        'footer-copyright': '© 2025 Nazarali Umurkulov. All rights reserved.',

        // Theme toggle
        'theme-toggle-light': 'Switch to Light Mode',
        'theme-toggle-dark': 'Switch to Dark Mode',
        'theme-switched': 'Switched to {theme} theme!',

        // Modal
        'modal-close': 'Close',
        'image-counter': 'Image {current} of {total}',

        // Notifications
        'notification-success': 'Success!',
        'notification-error': 'Error!',
        'notification-info': 'Info!',
        'lang-changed': 'Language changed to {lang}!',

        // New translations for "View Projects" and "View Certificates" buttons
        'btn-view-projects': 'Projects',
        'btn-view-certificates': 'Certificates'
    },

    tk: {
        // Navigation
        'nav-home': 'Baş sahypa',
        'nav-about': 'Hakda',
        'nav-projects': 'Layihalar',
        'nav-skills': 'Ukyplar',
        'nav-certificates': 'Şahadatnamalar',
        'nav-hobbies': 'Hobby',
        'nav-contact': 'Habarlaşmak',

        // Hero Section
        'word-compute': 'Sala',
        'hero-title': 'Adyňyz',
        'hero-subtitle': 'Kompýuter Inženeriýasy Talyby',
        'hero-description': 'Tokat Gaziosmanpaşa Uniwersitetinde 3-nji ýyl Kompýuter Inženeriýasy talyby, innovasion çözgütler döretmäge we tehnologiýanyň çäklerini zorlamaga höwesli.',
        'btn-download-cv': 'CV Göçür',
        'letter-o': 'm',
        'word-engineering': 'Men',
        // About Section
        'about-title': 'Men Hakda',
        'about-role': 'Mobil we Desktop Programma Önümçisi',
        'about-description': `Men Nazarali Umurkulov, 21 ýaşymda we Türkmenistanyň raýaty. Häzir Türkiýede Kompýuter Inženerligi boýunça okaýaryn.<br>Men programma üpjünçiligini döretmek, algoritm dizaýny we emeli aň programmalary bilen gyzyklanýaryn. Esasy maksadym mobil we web taslamalarynda netijeli çözgütler döretmek we ulanyjy tejribesini ileri tutmak. Şeýle hem maglumat işlemek, awtomatlaşdyrmak we akylly meýilnama ulgamlary boýunça taslamalarda işleyarin.`,
        'about-mobile': 'Mobil Önümçilik',
        'about-desktop': 'Desktop Programmalar',
        'about-3d': '3D Modelleme',
        'about-games': 'Oýun Önümçiligi',

        // Projects Section
        'projects-title': 'Esasy Layihalar',
        'project-planner-ai': 'Planner AI',
        'project-planner-description': 'Futuristik UI we akylly agent aýratynlyklary bilen AI bilen işleýän planlaşdyryjy we ýatlatma mobil programmasy.',
        'project-tech-flutter': 'Flutter',
        'project-tech-ai': 'AI',
        'project-tech-mobile': 'Mobil',

        // Skills Section
        'skills-title': 'Tehniki Ukyplar',
        'skills-programming': 'Programmirleme Dilleri',
        'skills-languages': 'Dil Ukyplary',
        'skills-specialized': 'Aýratyn Ukyplar',
        'skills-3d-modeling': '3D Modelleme (Blender)',
        'skills-ui-ux': 'UI/UX Dizaýn',
        'skills-game-dev': 'Oýun Önümçiligi',
        'skills-ai': 'Süni Akyl',

        // Programming Skills
        'skill-flutter': 'Flutter',
        'skill-html-css': 'HTML/CSS',
        'skill-csharp': 'C#',
        'skill-java': 'Java',
        'skill-python': 'Python',
        'skill-pascal': 'Pascal',

        // Language Skills
        'lang-english': 'Iňlisçe',
        'lang-turkish': 'Türkçe',
        'lang-turkmen': 'Türkmençe',
        'lang-russian': 'Rusça',
        'lang-level-b2': 'B2 - Orta ýokary',
        'lang-level-c1': 'C1 - Ýokary',
        'lang-level-c2': 'C2 - Ana dil',
        'lang-level-a1': 'A1 - Başlangyç',

        // Certificates Section
        'certificates-title': 'Şahadatnamalar we Ýetginjekler',
        'cert-llm': 'LLM Atölye',
        'cert-llm-desc': 'Generatiw AI we LLM Atölye Şahadatnamasy',
        'cert-python': 'Python Programmirleme',
        'cert-python-desc': 'Python Programmirleme Taýýarlygy Şahadatnamasy',
        'cert-gpt': 'Şahsy GPT-ler',
        'cert-gpt-desc': 'Şahsy GPT Önümçiligi Şahadatnamasy',
        'cert-ai-intro': 'AI-ya Giriş',
        'cert-ai-intro-desc': 'Süni Akyl Esaslary Şahadatnamasy',
        'cert-python-adv': 'Python Taýýarlygy',
        'cert-python-adv-desc': 'Ýokary Python Programmirleme Şahadatnamasy',
        'cert-general': 'Umumy Şahadatnama',
        'cert-general-desc': 'Käri Taýýarlygy Şahadatnamasy',
        'cert-csharp': 'C# Programmirleme',
        'cert-csharp-desc': 'C# Programmirleme Şahadatnamasy',
        'cert-java': 'Java Programmirleme',
        'cert-java-desc': 'Java Programmirleme Şahadatnamasy',
        'cert-cpp': 'C++ Programmirleme',
        'cert-cpp-desc': 'C++ Programmirleme Şahadatnamasy',
        'cert-photography': 'Fotografiýa',
        'cert-photography-desc': 'Esasy Fotografiýa Şahadatnamasy',
        'cert-web': 'Web Okuryzarlygy',
        'cert-web-desc': 'Web Okuryzarlygy Şahadatnamasy',
        'cert-office': 'Ofis Programmalary',
        'cert-office-desc': 'Belge Dolandyryşy we Ofis Programmalary',
        'cert-tech': 'Tehnologiýa Inowasiýasy',
        'cert-tech-desc': 'Tehnologiýa Inowasiýasy we Girişimçilik',
        'cert-comm': 'Habarlaşmak Tehnologiýasy',
        'cert-comm-desc': 'Täze Habarlaşmak Tehnologiýalary',
        'cert-system': 'Sistem Analizi',
        'cert-system-desc': 'Sistem Analizi we Dizaýn Şahadatnamasy',

        // Hobbies Section
        'hobbies-title': 'Hobby we Gyzyklanmalar',
        'hobby-photography': 'Fotografiýa',
        'hobby-photography-desc': 'Sagatlary ýazdyrmak we dünýäni obýektiw arkaly gözlemek',
        'hobby-painting': 'Surat Çekmek',
        'hobby-painting-desc': 'Reňkler we çetkiler arkaly döredijiligi aňlatmak',
        'hobby-game-dev': 'Oýun Önümçiligi',
        'hobby-game-dev-desc': 'Girýän dünýäler we interaktiw tejribeler döretmek',

        // Contact Section
        'contact-title': 'Habarlaşmak',
        'contact-lets-connect': 'Gel Habarlaşalyň',
        'contact-description': 'Men täze mümkinçilikler, gyzykly layihalar hakda gürlemäge ýa-da diňe tehnologiýa we inowasiýa hakda söhbet etmäge her wagt taýýar.',
        'contact-name-placeholder': 'Adyňyz',
        'contact-email-placeholder': 'Emailiňiz',
        'contact-message-placeholder': 'Habar',
        'btn-send-message': 'Habar Iber',

        // Footer
        'footer-copyright': '© 2025 Nazarali Umurkulov. Ähli hukuklar goraglan.',

        // Theme toggle
        'theme-toggle-light': 'Ýagty Tema Geç',
        'theme-toggle-dark': 'Gara Tema Geç',
        'theme-switched': '{theme} temasy geçildi!',

        // Modal
        'modal-close': 'Ýap',
        'image-counter': 'Surat {current} / {total}',

        // Notifications
        'notification-success': 'Üstünlik!',
        'notification-error': 'Hata!',
        'notification-info': 'Maglumat!',
        'lang-changed': 'Dil {lang} diline geçildi!',

        // New translations for "View Projects" and "View Certificates" buttons
        'btn-view-projects': 'Taslamalar',
        'btn-view-certificates': 'Sertifikatlar'
    },

    tr: {
        // Navigation
        'nav-home': 'Ana Sayfa',
        'nav-about': 'Hakkımda',
        'nav-projects': 'Projeler',
        'nav-skills': 'Yetenekler',
        'nav-certificates': 'Sertifikalar',
        'nav-hobbies': 'Hobiler',
        'nav-contact': 'İletişim',

        // Hero Section
        'word-compute': 'Merhab',
        'hero-title': 'Adınız',
        'hero-subtitle': 'Bilgisayar Mühendisliği Öğrencisi',
        'hero-description': 'Tokat Gaziosmanpaşa Üniversitesi 3. sınıf Bilgisayar Mühendisliği öğrencisi, yenilikçi çözümler yaratmaya ve teknolojinin sınırlarını zorlamaya tutkulu.',
        'btn-download-cv': 'CV İndir',
        'letter-o': 'a',
        'word-engineering': 'Ben',
        // About Section
        'about-title': 'Hakkımda',
        'about-role': 'Mobil ve Masaüstü Uygulama Geliştiricisi',
        'about-description': `Ben Nazarali Umurkulov, 21 yaşındayım ve Türkmenistan vatandaşıyım. Şu anda Türkiye'de Bilgisayar Mühendisliği okuyorum.<br>Yazılım geliştirme, algoritma tasarımı ve yapay zeka uygulamalarına tutkuyla bağlıyım. Odak noktam, mobil ve web projelerinde verimli çözümler üretmek ve kullanıcı deneyimini ön planda tutmak. Ayrıca veri işleme, otomasyon ve akıllı planlama sistemleri üzerine projeler geliştiriyorum.`,
        'about-mobile': 'Mobil Geliştirme',
        'about-desktop': 'Masaüstü Uygulamalar',
        'about-3d': '3D Modelleme',
        'about-games': 'Oyun Geliştirme',

        // Projects Section
        'projects-title': 'Öne Çıkan Projeler',
        'project-planner-ai': 'Planner AI',
        'project-planner-description': 'Futuristik UI ve akıllı ajan özellikleri ile AI destekli planlayıcı ve hatırlatıcı mobil uygulama.',
        'project-tech-flutter': 'Flutter',
        'project-tech-ai': 'AI',
        'project-tech-mobile': 'Mobil',

        // Skills Section
        'skills-title': 'Teknik Yetenekler',
        'skills-programming': 'Programlama Dilleri',
        'skills-languages': 'Dil Yetenekleri',
        'skills-specialized': 'Özel Yetenekler',
        'skills-3d-modeling': '3D Modelleme (Blender)',
        'skills-ui-ux': 'UI/UX Tasarım',
        'skills-game-dev': 'Oyun Geliştirme',
        'skills-ai': 'Yapay Zeka',

        // Programming Skills
        'skill-flutter': 'Flutter',
        'skill-html-css': 'HTML/CSS',
        'skill-csharp': 'C#',
        'skill-java': 'Java',
        'skill-python': 'Python',
        'skill-pascal': 'Pascal',

        // Language Skills
        'lang-english': 'İngilizce',
        'lang-turkish': 'Türkçe',
        'lang-turkmen': 'Türkmence',
        'lang-russian': 'Rusça',
        'lang-level-b2': 'B2 - Orta Üstü',
        'lang-level-c1': 'C1 - İleri',
        'lang-level-c2': 'C2 - Ana Dil',
        'lang-level-a1': 'A1 - Başlangıç',

        // Certificates Section
        'certificates-title': 'Sertifikalar ve Başarılar',
        'cert-llm': 'LLM Atölyesi',
        'cert-llm-desc': 'Generatif AI ve LLM Atölyesi Sertifikası',
        'cert-python': 'Python Programlama',
        'cert-python-desc': 'Python Programlama Eğitimi Sertifikası',
        'cert-gpt': 'Kişiselleştirilmiş GPT\'ler',
        'cert-gpt-desc': 'Özel GPT Geliştirme Sertifikası',
        'cert-ai-intro': 'AI\'ya Giriş',
        'cert-ai-intro-desc': 'Yapay Zeka Temelleri Sertifikası',
        'cert-python-adv': 'Python Eğitimi',
        'cert-python-adv-desc': 'İleri Python Programlama Sertifikası',
        'cert-general': 'Genel Sertifika',
        'cert-general-desc': 'Mesleki Gelişim Sertifikası',
        'cert-csharp': 'C# Programlama',
        'cert-csharp-desc': 'C# Programlama Sertifikası',
        'cert-java': 'Java Programlama',
        'cert-java-desc': 'Java Programlama Sertifikası',
        'cert-cpp': 'C++ Programlama',
        'cert-cpp-desc': 'C++ Programlama Sertifikası',
        'cert-photography': 'Fotoğrafçılık',
        'cert-photography-desc': 'Temel Fotoğrafçılık Sertifikası',
        'cert-web': 'Web Okuryazarlığı',
        'cert-web-desc': 'Web Okuryazarlığı Sertifikası',
        'cert-office': 'Ofis Uygulamaları',
        'cert-office-desc': 'Belge Yönetimi ve Ofis Uygulamaları',
        'cert-tech': 'Teknoloji İnovasyonu',
        'cert-tech-desc': 'Teknoloji İnovasyonu ve Girişimcilik',
        'cert-comm': 'İletişim Teknolojileri',
        'cert-comm-desc': 'Yeni İletişim Teknolojileri',
        'cert-system': 'Sistem Analizi',
        'cert-system-desc': 'Sistem Analizi ve Tasarım Sertifikası',

        // Hobbies Section
        'hobbies-title': 'Hobiler ve İlgi Alanları',
        'hobby-photography': 'Fotoğrafçılık',
        'hobby-photography-desc': 'Anları yakalamak ve dünyayı lens aracılığıyla keşfetmek',
        'hobby-painting': 'Resim',
        'hobby-painting-desc': 'Renkler ve fırça darbeleri ile yaratıcılığı ifade etmek',
        'hobby-game-dev': 'Oyun Geliştirme',
        'hobby-game-dev-desc': 'Sürükleyici dünyalar ve interaktif deneyimler yaratmak',

        // Contact Section
        'contact-title': 'İletişime Geç',
        'contact-lets-connect': 'Bağlantı Kuralım',
        'contact-description': 'Yeni fırsatlar, ilginç projeler hakkında konuşmaya veya sadece teknoloji ve inovasyon hakkında sohbet etmeye her zaman açığım.',
        'contact-name-placeholder': 'Adınız',
        'contact-email-placeholder': 'E-posta Adresiniz',
        'contact-message-placeholder': 'Mesajınız',
        'btn-send-message': 'Mesaj Gönder',

        // Footer
        'footer-copyright': '© 2025 Nazarali Umurkulov. Tüm haklar saklıdır.',

        // Theme toggle
        'theme-toggle-light': 'Açık Temaya Geç',
        'theme-toggle-dark': 'Koyu Temaya Geç',
        'theme-switched': '{theme} temasına geçildi!',

        // Modal
        'modal-close': 'Kapat',
        'image-counter': 'Resim {current} / {total}',

        // Notifications
        'notification-success': 'Başarılı!',
        'notification-error': 'Hata!',
        'notification-info': 'Bilgi!',
        'lang-changed': 'Dil {lang} diline değiştirildi!',

        // New translations for "View Projects" and "View Certificates" buttons
        'btn-view-projects': 'Projeler',
        'btn-view-certificates': 'Sertifikalar'
    },

    ru: {
        // Navigation
        'nav-home': 'Главная',
        'nav-about': 'Обо мне',
        'nav-projects': 'Проекты',
        'nav-skills': 'Навыки',
        'nav-certificates': 'Сертификаты',
        'nav-hobbies': 'Хобби',
        'nav-contact': 'Контакты',

        // Hero Section
        'word-compute': 'Приве',
        'hero-title': 'Ваше Имя',
        'hero-subtitle': 'Студент Компьютерной Инженерии',
        'hero-description': 'Студент 3-го курса Компьютерной Инженерии в Университете Токат Газиосманпаша, увлеченный созданием инновационных решений и расширением границ технологий.',
        'btn-download-cv': 'Скачать CV',
        'letter-o': 'т',
        'word-engineering': 'Я',
        // About Section
        'about-title': 'Обо мне',
        'about-role': 'Разработчик Мобильных и Десктопных Приложений',
        'about-description': `Я Назарали Умуркулов, мне 21 год, гражданин Туркменистана. В настоящее время учусь на факультете компьютерной инженерии в Турции.<br>Я увлечен разработкой программного обеспечения, проектированием алгоритмов и приложениями искусственного интеллекта. Моя цель — создавать эффективные решения для мобильных и веб-проектов, уделяя особое внимание пользовательскому опыту. Также работал над проектами по обработке данных, автоматизации и интеллектуальным системам планирования.`,
        'about-mobile': 'Мобильная Разработка',
        'about-desktop': 'Десктопные Приложения',
        'about-3d': '3D Моделирование',
        'about-games': 'Разработка Игр',

        // Projects Section
        'projects-title': 'Основные Проекты',
        'project-planner-ai': 'Planner AI',
        'project-planner-description': 'Мобильное приложение-планировщик и напоминатель с поддержкой ИИ, футуристическим UI и функциями умного агента.',
        'project-tech-flutter': 'Flutter',
        'project-tech-ai': 'ИИ',
        'project-tech-mobile': 'Мобильное',

        // Skills Section
        'skills-title': 'Технические Навыки',
        'skills-programming': 'Языки Программирования',
        'skills-languages': 'Языковые Навыки',
        'skills-specialized': 'Специализированные Навыки',
        'skills-3d-modeling': '3D Моделирование (Blender)',
        'skills-ui-ux': 'UI/UX Дизайн',
        'skills-game-dev': 'Разработка Игр',
        'skills-ai': 'Искусственный Интеллект',

        // Programming Skills
        'skill-flutter': 'Flutter',
        'skill-html-css': 'HTML/CSS',
        'skill-csharp': 'C#',
        'skill-java': 'Java',
        'skill-python': 'Python',
        'skill-pascal': 'Pascal',

        // Language Skills
        'lang-english': 'Английский',
        'lang-turkish': 'Турецкий',
        'lang-turkmen': 'Туркменский',
        'lang-russian': 'Русский',
        'lang-level-b2': 'B2 - Выше Среднего',
        'lang-level-c1': 'C1 - Продвинутый',
        'lang-level-c2': 'C2 - Родной',
        'lang-level-a1': 'A1 - Начинающий',

        // Certificates Section
        'certificates-title': 'Сертификаты и Достижения',
        'cert-llm': 'LLM Мастерская',
        'cert-llm-desc': 'Сертификат Генеративной ИИ и LLM Мастерской',
        'cert-python': 'Программирование на Python',
        'cert-python-desc': 'Сертификат Обучения Программированию на Python',
        'cert-gpt': 'Персонализированные GPT',
        'cert-gpt-desc': 'Сертификат Разработки Персональных GPT',
        'cert-ai-intro': 'Введение в ИИ',
        'cert-ai-intro-desc': 'Сертификат Основ Искусственного Интеллекта',
        'cert-python-adv': 'Обучение Python',
        'cert-python-adv-desc': 'Сертификат Продвинутого Программирования на Python',
        'cert-general': 'Общий Сертификат',
        'cert-general-desc': 'Сертификат Профессионального Развития',
        'cert-csharp': 'Программирование на C#',
        'cert-csharp-desc': 'Сертификат Программирования на C#',
        'cert-java': 'Программирование на Java',
        'cert-java-desc': 'Сертификат Программирования на Java',
        'cert-cpp': 'Программирование на C++',
        'cert-cpp-desc': 'Сертификат Программирования на C++',
        'cert-photography': 'Фотография',
        'cert-photography-desc': 'Сертификат Основ Фотографии',
        'cert-web': 'Веб-грамотность',
        'cert-web-desc': 'Сертификат Веб-грамотности',
        'cert-office': 'Офисные Приложения',
        'cert-office-desc': 'Управление Документами и Офисные Приложения',
        'cert-tech': 'Технологические Инновации',
        'cert-tech-desc': 'Технологические Инновации и Предпринимательство',
        'cert-comm': 'Коммуникационные Технологии',
        'cert-comm-desc': 'Новые Коммуникационные Технологии',
        'cert-system': 'Анализ Систем',
        'cert-system-desc': 'Сертификат Анализа и Проектирования Систем',

        // Hobbies Section
        'hobbies-title': 'Хобби и Интересы',
        'hobby-photography': 'Фотография',
        'hobby-photography-desc': 'Захватывать моменты и исследовать мир через объектив',
        'hobby-painting': 'Рисование',
        'hobby-painting-desc': 'Выражать творчество через цвета и мазки кисти',
        'hobby-game-dev': 'Разработка Игр',
        'hobby-game-dev-desc': 'Создавать захватывающие миры и интерактивные впечатления',

        // Contact Section
        'contact-title': 'Связаться',
        'contact-lets-connect': 'Давайте Свяжемся',
        'contact-description': 'Я всегда открыт для обсуждения новых возможностей, интересных проектов или просто для разговора о технологиях и инновациях.',
        'contact-name-placeholder': 'Ваше Имя',
        'contact-email-placeholder': 'Ваш Email',
        'contact-message-placeholder': 'Ваше Сообщение',
        'btn-send-message': 'Отправить Сообщение',

        // Footer
        'footer-copyright': '© 2025 Nazarali Umurkulov. Все права защищены.',

        // Theme toggle
        'theme-toggle-light': 'Переключиться на Светлую Тему',
        'theme-toggle-dark': 'Переключиться на Темную Тему',
        'theme-switched': 'Переключено на {theme} тему!',

        // Modal
        'modal-close': 'Закрыть',
        'image-counter': 'Изображение {current} из {total}',

        // Notifications
        'notification-success': 'Успех!',
        'notification-error': 'Ошибка!',
        'notification-info': 'Информация!',
        'lang-changed': 'Язык изменен на {lang}!',

        // New translations for "View Projects" and "View Certificates" buttons
        'btn-view-projects': 'Проекты',
        'btn-view-certificates': 'Сертификаты'
    }
};

// Language selector functionality
function initLanguageSelector() {
    const languageSelector = document.getElementById('languageSelector');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLang = document.querySelector('.current-lang');

    // Always start with English (reset on each session)
    const savedLanguage = 'en'; // Force reset to English
    setLanguage(savedLanguage);

    // Toggle dropdown
    languageSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageDropdown.classList.remove('active');
    });

    // Language selection
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            languageDropdown.classList.remove('active');

            // Show language change notification
            const langName = option.querySelector('.lang-name').textContent;
            showNotification(`Language changed to ${langName}!`, 'info');
        });
    });
}

// Set language function
function setLanguage(lang) {
    // Update current language display
    const currentLang = document.querySelector('.current-lang');
    const langNames = { 'en': 'EN', 'tk': 'TK', 'tr': 'TR', 'ru': 'RU' };
    currentLang.textContent = langNames[lang];

    // Update active state in dropdown
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });

    // Update all text content
    updatePageContent(lang);
}

// Update page content with translations
function updatePageContent(lang) {
    const currentTranslations = translations[lang];

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#home') link.textContent = currentTranslations['nav-home'];
        if (href === '#about') link.textContent = currentTranslations['nav-about'];
        if (href === '#projects') link.textContent = currentTranslations['nav-projects'];
        if (href === '#skills') link.textContent = currentTranslations['nav-skills'];
        if (href === '#certificates') link.textContent = currentTranslations['nav-certificates'];
        if (href === '#hobbies') link.textContent = currentTranslations['nav-hobbies'];
        if (href === '#contact') link.textContent = currentTranslations['nav-contact'];
    });

    // Hero Section
    const titleLine = document.querySelector('.word-compute');
    if (titleLine) titleLine.textContent = currentTranslations['word-compute'];

    const titleoText = document.querySelector('.letter-o-text');
    if (titleoText) titleoText.textContent = currentTranslations['letter-o'];

    const titleEngineering = document.querySelector('.word-engineering');
    if (titleEngineering) titleEngineering.textContent = currentTranslations['word-engineering'];

    const titleSubtitle = document.querySelector('.title-subtitle');
    if (titleSubtitle) titleSubtitle.textContent = currentTranslations['hero-subtitle'];

    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = currentTranslations['hero-description'];

    // Section Titles
    const aboutTitle = document.querySelector('#about .section-title');
    if (aboutTitle) aboutTitle.textContent = currentTranslations['about-title'];

    const projectsTitle = document.querySelector('#projects .section-title');
    if (projectsTitle) projectsTitle.textContent = currentTranslations['projects-title'];

    const skillsTitle = document.querySelector('#skills .section-title');
    if (skillsTitle) skillsTitle.textContent = currentTranslations['skills-title'];

    const certificatesTitle = document.querySelector('#certificates .section-title');
    if (certificatesTitle) certificatesTitle.textContent = currentTranslations['certificates-title'];

    const hobbiesTitle = document.querySelector('#hobbies .section-title');
    if (hobbiesTitle) hobbiesTitle.textContent = currentTranslations['hobbies-title'];

    const contactTitle = document.querySelector('#contact .section-title');
    if (contactTitle) contactTitle.textContent = currentTranslations['contact-title'];

    // About Section
    const aboutRole = document.querySelector('.about-text h3');
    if (aboutRole) aboutRole.textContent = currentTranslations['about-role'];

    // Sadece #about-description güncellensin

    // Skills Categories
    const skillCategories = document.querySelectorAll('.skill-category h3');
    if (skillCategories[0]) skillCategories[0].textContent = currentTranslations['skills-programming'];
    if (skillCategories[1]) skillCategories[1].textContent = currentTranslations['skills-languages'];
    if (skillCategories[2]) skillCategories[2].textContent = currentTranslations['skills-specialized'];

    // Language Skills
    const langSkills = document.querySelectorAll('#skills .skill-category:nth-child(2) .skill-name');
    if (langSkills[0]) langSkills[0].textContent = currentTranslations['lang-english'];
    if (langSkills[1]) langSkills[1].textContent = currentTranslations['lang-turkish'];
    if (langSkills[2]) langSkills[2].textContent = currentTranslations['lang-turkmen'];
    if (langSkills[3]) langSkills[3].textContent = currentTranslations['lang-russian'];

    const langLevels = document.querySelectorAll('#skills .skill-category:nth-child(2) .skill-level');
    if (langLevels[0]) langLevels[0].textContent = currentTranslations['lang-level-b2'];
    if (langLevels[1]) langLevels[1].textContent = currentTranslations['lang-level-c1'];
    if (langLevels[2]) langLevels[2].textContent = currentTranslations['lang-level-c2'];
    if (langLevels[3]) langLevels[3].textContent = currentTranslations['lang-level-a1'];

    // Footer
    const footerCopyright = document.querySelector('.footer p');
    if (footerCopyright) footerCopyright.textContent = currentTranslations['footer-copyright'];

    // About section
    const aboutDescription = document.getElementById('about-description');
    if (aboutDescription) {
        aboutDescription.innerHTML = translations[lang]['about-description'] || translations['en']['about-description'];
    }

    // Hero Buttons
    const projectsBtn = document.querySelector('.btn-projects');
    if (projectsBtn) projectsBtn.textContent = currentTranslations['btn-view-projects'];

    const certificatesBtn = document.querySelector('.btn-certificates');
    if (certificatesBtn) certificatesBtn.textContent = currentTranslations['btn-view-certificates'];
}
