// ===== LOADING SCREEN =====
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loaderProgress = document.querySelector('.loader-progress');

    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            // Hide loading screen after animation completes
            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 0.8s ease, visibility 0.8s';
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';

                // Initialize other features after loading
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    initParticles();
                    initAnimations();
                }, 800);
            }, 500);
        }
        loaderProgress.style.width = progress + '%';
    }, 200);
});

// ===== PARTICLES =====
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random properties
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.5 + 0.2;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
            background: ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)'};
        `;

        container.appendChild(particle);
    }
}

// ===== CUSTOM CURSOR =====
document.addEventListener('mousemove', (e) => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';

    // Slight delay for outline
    setTimeout(() => {
        cursorOutline.style.left = e.clientX + 'px';
        cursorOutline.style.top = e.clientY + 'px';
    }, 50);
});

// Cursor hover effects
document.querySelectorAll('a, button, .project-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.querySelector('.cursor-outline').style.width = '60px';
        document.querySelector('.cursor-outline').style.height = '60px';
        document.querySelector('.cursor-outline').style.borderColor = 'var(--secondary)';
    });

    el.addEventListener('mouseleave', () => {
        document.querySelector('.cursor-outline').style.width = '40px';
        document.querySelector('.cursor-outline').style.height = '40px';
        document.querySelector('.cursor-outline').style.borderColor = 'var(--primary)';
    });
});

// Hide custom cursor on mobile
if ('ontouchstart' in window) {
    document.querySelector('.cursor-dot').style.display = 'none';
    document.querySelector('.cursor-outline').style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
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
        const sectionHeight = section.clientHeight;

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
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (index * 0.1) + 's';
        revealObserver.observe(el);
    });
}

// ===== STAT COUNTER ANIMATION =====
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
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// ===== SKILL BARS ANIMATION =====
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
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.5s ease forwards';
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

    // Get form data
    const formData = new FormData(contactForm);
    const name = document.getElementById('name').value;

    // Show success message (you can replace this with actual form submission)
    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc6a)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        contactForm.reset();
    }, 3000);
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
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

// ===== 3D TILT EFFECT FOR CARDS =====
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-card');

    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== GLITCH EFFECT =====
function glitchEffect(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let iterations = 0;
    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            })
            .join('');

        if (iterations >= originalText.length) {
            clearInterval(interval);
        }

        iterations += 1/3;
    }, 30);
}

// Apply glitch effect on hover to logo
document.querySelector('.logo-text').addEventListener('mouseenter', function() {
    glitchEffect(this);
});

// ===== MOUSE GLOW EFFECT =====
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.video-overlay');
    if (glow) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        glow.style.background = `
            radial-gradient(circle at ${x}% ${y}%, 
            rgba(0, 240, 255, 0.1) 0%, 
            rgba(10, 10, 10, 0.9) 50%)
        `;
    }
});

// ===== CONFETTI ON BUTTON CLICK =====
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        createConfetti(e.clientX, e.clientY);
    });
});

function createConfetti(x, y) {
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 2px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 99999;
        `;

        document.body.appendChild(confetti);

        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = x;
        let posY = y;
        let opacity = 1;

        const animate = () => {
            posX += vx * 0.02;
            posY += vy * 0.02 + 2;
            opacity -= 0.02;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;
            confetti.style.transform = `rotate(${posX * 2}deg)`;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

console.log('%c Jexk Not Dev ', 'background: linear-gradient(135deg, #00f0ff, #ff00e4); color: #000; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 10px;');
console.log('%c Portfolio Loaded Successfully! ', 'color: #00f0ff; font-size: 14px;');
