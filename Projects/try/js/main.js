// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
}

// ===== HERO SLIDER =====
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    const counter = document.querySelector('.slide-num');
    if (counter) counter.textContent = current + 1;
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(next, 7500);
  }

  const btnNext = document.querySelector('.slider-next');
  const btnPrev = document.querySelector('.slider-prev');
  if (btnNext) btnNext.addEventListener('click', () => { next(); autoPlay(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { prev(); autoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); autoPlay(); });
  });

  autoPlay();
}

// ===== PRODUCT THUMB SWITCHER =====
function initThumbs() {
  document.querySelectorAll('.pd-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const mainImg = document.getElementById('pdMainImg');
      if (mainImg) mainImg.src = this.dataset.src;
      document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  document.querySelectorAll('.more-img-item').forEach(item => {
    item.addEventListener('click', function() {
      const mainImg = document.getElementById('pdMainImg');
      if (mainImg) {
        mainImg.src = this.dataset.src;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const btn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');
  if (btn && toast) {
    btn.addEventListener('click', () => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    });
  }
}

// ===== ACTIVE NAV LINK =====
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list > li > a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initThumbs();
  initContactForm();
  setActiveNav();
});