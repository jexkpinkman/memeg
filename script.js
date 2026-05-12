// ===== LOADING SCREEN =====
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loaderProgress = document.querySelector('.loader-progress');

    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 12;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 0.6s ease';
                loadingScreen.style.opacity = '0';

                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    initAnimations();
                }, 600);
            }, 400);
        }
        loaderProgress.style.width = progress + '%';
    }, 180);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== ANIMATIONS ON SCROLL =====
function initAnimations() {
    const revealElements = document.querySelectorAll('.glass-card, .section-header, .skill-item, .project-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (index * 0.08) + 's';
        revealObserver.observe(el);
    });
}

// ===== STAT COUNTER =====
const statNumbers = document.querySelectorAll('.stat-number');

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statsObserver.observe(stat));

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 40;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 40);
}

// ===== SKILL BARS =====
const skillBars = document.querySelectorAll('.skill-progress');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width + '%';
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillsObserver.observe(bar));

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>Message Sent</span> <i class="fas fa-check"></i>';
    btn.style.background = '#4ade80';
    btn.style.color = '#0c0c0e';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        contactForm.reset();
    }, 2500);
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== SUBTLE TILT FOR CARDS =====
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 50;
        const rotateY = (centerX - x) / 50;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

console.log('%c Jexk Not Dev ', 'background: #b8956a; color: #0c0c0e; font-size: 14px; font-weight: 600; padding: 8px 16px; border-radius: 6px;');
console.log('%c Developer Portfolio ', 'color: #8b9dc3; font-size: 12px;');
