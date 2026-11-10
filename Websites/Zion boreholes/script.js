const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.primary-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const revealItems = document.querySelectorAll('.intro-grid, .value-item, .service-card, .proof-grid, .process-step, .irrigation-grid, .contact-grid, .faq-grid');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add('revealed'));
}

document.getElementById('year').textContent = new Date().getFullYear();

const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Website enquiry: ${data.get('service')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nService: ${data.get('service')}\n\nProject details:\n${data.get('message')}`);
  window.location.href = `mailto:zboreholes@gmail.com?subject=${subject}&body=${body}`;
  if (formNote) formNote.textContent = 'Your email app should open with the enquiry ready to send.';
});

// Keep local videos graceful when a supplied asset is unavailable.
document.querySelectorAll('video').forEach((video) => {
  video.addEventListener('error', () => video.closest('.video-frame, .irrigation-media, .hero')?.classList.add('video-unavailable'));
});
