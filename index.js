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

// Mobile menu
const btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
btn.addEventListener('click', () => btn.setAttribute('aria-expanded', menu.classList.toggle('open')));
menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });

// Highlight current section in nav
const links = [...menu.querySelectorAll('a:not(.nav-cta)')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.hash === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// Gentle reveal for sections below the hero
const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: .1 });
document.querySelectorAll('main section:not(#home)').forEach(s => { s.classList.add('reveal'); rev.observe(s); });

// Gallery lightbox
const lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
document.querySelectorAll('.g').forEach(b => b.addEventListener('click', () => {
  lbImg.src = b.dataset.src; lbImg.alt = b.querySelector('img').alt; lb.hidden = false; lb.querySelector('button').focus();
}));
lb.addEventListener('click', () => lb.hidden = true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

// Contact form opens the visitor's email app, pre-filled
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const n = name.value.trim(), m = email.value.trim(), msg = message.value.trim(), note = document.getElementById('note');
  if (!n || !/^\S+@\S+\.\S+$/.test(m) || !msg) { note.textContent = 'Please enter your name, a valid email and a message.'; return; }
  const body = encodeURIComponent(`${msg}\n\nFrom: ${n} (${m})`);
  location.href = `mailto:mohanbhattarai706@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + n)}&body=${body}`;
  note.textContent = 'Opening your email app to send the message.';
});

document.getElementById('copy').innerHTML = `&copy; ${new Date().getFullYear()} Sudip Bhattarai`;
