/* ============================================================
   JACSICOE — Jayaraj Annapackiam CSI College of Engineering
   script.js  |  Main JavaScript
   ============================================================ */

/* ===================================================
   1. THEME TOGGLE (Dark / Light Mode)
   =================================================== */
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;
let dark          = false;

function setTheme(isDark) {
  dark = isDark;
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Restore saved preference on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') setTheme(true);

themeToggle.addEventListener('click', () => setTheme(!dark));


/* ===================================================
   2. NAVBAR — Scroll shadow + active state
   =================================================== */
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  backTop.classList.toggle('visible', window.scrollY > 400);
});


/* ===================================================
   3. MOBILE NAV — Hamburger toggle
   =================================================== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  const spans  = hamburger.querySelectorAll('span');

  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

/** Close mobile nav (called from onclick on links) */
function closeMobileNav() {
  mobileNav.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => {
    s.style.transform = '';
    s.style.opacity   = '';
  });
}


/* ===================================================
   4. SCROLL REVEAL — Intersection Observer
   =================================================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ===================================================
   5. ANIMATED COUNTERS
   =================================================== */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 2000; // ms
  const step     = target / (duration / 16); // ~60 fps
  let current    = 0;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target); // only animate once
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});


/* ===================================================
   6. TESTIMONIAL SLIDER
   =================================================== */
const track         = document.getElementById('testimonialTrack');
const cards         = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('sliderDots');
let currentSlide    = 0;
let cardsPerView    = 3;

function getCardsPerView() {
  if (window.innerWidth < 768)  return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function buildDots() {
  if (!dotsContainer || cards.length === 0) return;
  dotsContainer.innerHTML = '';
  const totalSlides = Math.ceil(cards.length / cardsPerView);

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === currentSlide ? ' active' : '');
    dot.addEventListener('click', () => {
      currentSlide = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  }
}

function updateSlider() {
  if (!track || cards.length === 0) return;
  cardsPerView = getCardsPerView();
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  currentSlide      = Math.max(0, Math.min(currentSlide, totalSlides - 1));
  const cardWidth   = cards[0].getBoundingClientRect().width + 24; // gap = 1.5rem ≈ 24px
  track.style.transform = `translateX(-${currentSlide * cardsPerView * cardWidth}px)`;

  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
}

/** Called from HTML onclick buttons */
function slideTestimonials(dir) {
  cardsPerView = getCardsPerView();
  const totalSlides = Math.ceil(cards.length / cardsPerView);
  currentSlide      = (currentSlide + dir + totalSlides) % totalSlides;
  updateSlider();
  buildDots();
}

window.addEventListener('resize', () => {
  cardsPerView = getCardsPerView();
  buildDots();
  updateSlider();
});

// Init slider
buildDots();

// Auto-advance every 5 seconds
setInterval(() => slideTestimonials(1), 5000);


/* ===================================================
   7. LIGHTBOX
   =================================================== */
function openLightbox(emoji, caption) {
  const lb      = document.getElementById('lightbox');
  const imgEl   = document.getElementById('lightboxImg');
  const capEl   = document.getElementById('lightboxCaption');

  imgEl.textContent    = emoji;
  imgEl.style.fontSize = '6rem';
  capEl.textContent    = caption;

  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
  const lb = document.getElementById('lightbox');
  // Close when clicking the backdrop or the close button
  if (
    !e ||
    e.target === lb ||
    (e.currentTarget && e.currentTarget.classList.contains('lightbox-close'))
  ) {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLightbox({ target: document.getElementById('lightbox') });
  }
});


/* ===================================================
   8. CONTACT FORM — Submit feedback
   =================================================== */
function handleFormSubmit(btn) {
  const originalText = btn.textContent;
  btn.textContent    = 'Sending…';
  btn.disabled       = true;

  setTimeout(() => {
    btn.textContent       = '✓ Inquiry Sent!';
    btn.style.background  = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
      btn.textContent      = originalText;
      btn.disabled         = false;
      btn.style.background = '';
    }, 3000);
  }, 1500);
}


/* ===================================================
   9. PARALLAX — Hero section on scroll
   =================================================== */
window.addEventListener('scroll', () => {
  const scrollY      = window.scrollY;
  const heroContent  = document.querySelector('.hero-content');
  const orb1         = document.querySelector('.hero-orb-1');
  const orb2         = document.querySelector('.hero-orb-2');

  if (heroContent) heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
  if (orb1)        orb1.style.transform        = `translateY(${scrollY * 0.15}px)`;
  if (orb2)        orb2.style.transform        = `translateY(${-scrollY * 0.1}px)`;
});


/* ===================================================
   10. BACK TO TOP
   =================================================== */
document.getElementById('backTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});