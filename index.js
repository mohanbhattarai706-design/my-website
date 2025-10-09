window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
});

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

function scrollToHome() {
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();

    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const heroHeight = parallax ? parallax.offsetHeight : 0;
    
    if (parallax && scrolled < heroHeight) {
        const fadeStart = heroHeight * 0.6;
        if (scrolled > fadeStart) {
            const fadeProgress = (scrolled - fadeStart) / (heroHeight - fadeStart);
            parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
            parallax.style.opacity = 1 - fadeProgress;
        } else {
            parallax.style.transform = `translateY(0)`;
            parallax.style.opacity = 1;
        }
    }
});

const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
    });
});

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

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

function handleFormSubmit() {
    alert('Thank you for your message! I will get back to you soon.');
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}

const year = new Date().getFullYear();
document.querySelector('footer p').innerHTML = `&copy; ${year} Sudip Bhattarai. All rights reserved.`;