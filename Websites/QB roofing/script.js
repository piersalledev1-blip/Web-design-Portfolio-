const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// If a supplied asset is missing, keep the designed gradient treatment instead of a broken image.
document.querySelectorAll('.image-slot').forEach((slot) => {
  const asset = slot.dataset.image;
  const probe = new Image();
  probe.src = `assets/${asset}`;
  probe.onerror = () => slot.classList.add('asset-missing');
});

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      counter.textContent = (target % 1 ? value.toFixed(1) : Math.floor(value).toLocaleString());
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(counter);
  });
}, { threshold: 0.65 });
counters.forEach((counter) => counterObserver.observe(counter));

const form = document.querySelector('#quote-form');
const note = document.querySelector('.form-note');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  button.innerHTML = 'Request received <span>✓</span>';
  note.textContent = 'Thank you — a roofing specialist will be in touch shortly.';
  form.reset();
  window.setTimeout(() => {
    button.disabled = false;
    button.innerHTML = 'Request a consultation <span>↗</span>';
  }, 4500);
});

document.querySelector('#year').textContent = new Date().getFullYear();
