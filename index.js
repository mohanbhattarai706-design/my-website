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

// Gallery lightbox with previous / next
const lb = document.getElementById('lightbox'), lbImg = lb.querySelector('img');
const shots = [...document.querySelectorAll('.g')]; let cur = 0;
function show(i) { cur = (i + shots.length) % shots.length; lbImg.src = shots[cur].dataset.src; lbImg.alt = shots[cur].querySelector('img').alt; lb.hidden = false; }
shots.forEach((b, i) => b.addEventListener('click', () => { show(i); lb.querySelector('.lb-close').focus(); }));
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-close')) lb.hidden = true; });
lb.querySelector('.prev').addEventListener('click', () => show(cur - 1));
lb.querySelector('.next').addEventListener('click', () => show(cur + 1));
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') lb.hidden = true;
  if (e.key === 'ArrowLeft') show(cur - 1);
  if (e.key === 'ArrowRight') show(cur + 1);
});

// Typing effect in the hero
const roles = ['clean, responsive websites.', 'tools with Python.', 'apps with C#.', 'things that work.'];
const typed = document.getElementById('typed');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) { typed.textContent = roles[0]; }
else { let r = 0, c = 0, del = false;
  (function tick() {
    const w = roles[r]; typed.textContent = w.slice(0, c);
    if (!del && c === w.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
    c += del ? -1 : 1; setTimeout(tick, del ? 35 : 70);
  })(); }

// Scroll progress bar and back-to-top button
const bar = document.getElementById('progress'), top_ = document.getElementById('toTop');
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (scrollY / max * 100) + '%';
  top_.classList.toggle('show', scrollY > 600);
}, { passive: true });

// Light / dark toggle (remembers choice)
const root = document.documentElement, tb = document.getElementById('themeBtn');
try { const s = localStorage.getItem('theme'); if (s) root.dataset.theme = s; } catch (e) {}
tb.addEventListener('click', () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

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
