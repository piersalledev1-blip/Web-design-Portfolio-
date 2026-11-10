/* =========================
   A. NAVIGATION
========================= */

const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");


// Sticky navbar + shrink on scroll

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.remove("nav-transparent");
    navbar.classList.add("nav-scrolled");
  } else {
    navbar.classList.remove("nav-scrolled");
    navbar.classList.add("nav-transparent");
  }
}

window.addEventListener("scroll", handleNavbarScroll);

handleNavbarScroll();


// Mobile menu

menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);

  if (isOpen) {
    menuIcon.classList.remove("fa-bars");
    menuIcon.classList.add("fa-xmark");
  } else {
    menuIcon.classList.remove("fa-xmark");
    menuIcon.classList.add("fa-bars");
  }
});


// Close mobile menu when a link is clicked

const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuIcon.classList.remove("fa-xmark");
    menuIcon.classList.add("fa-bars");
  });
});


// Close mobile menu when screen becomes desktop

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    mobileMenu.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuIcon.classList.remove("fa-xmark");
    menuIcon.classList.add("fa-bars");
  }
});

/* =========================
   C. ANIMATED STAT COUNTERS
========================= */

const statNumbers = document.querySelectorAll(".stat-number");

let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;

  const statsSection = document.getElementById("trust-stats");

  if (!statsSection) return;

  const sectionPosition = statsSection.getBoundingClientRect();

  if (sectionPosition.top < window.innerHeight * 0.85) {
    statsAnimated = true;

    statNumbers.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix || "";

      let current = 0;

      const duration = 1500;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 3);

        current = Math.floor(target * easedProgress);

        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

window.addEventListener("scroll", animateStats);

animateStats();

/* =========================
   H. TESTIMONIAL CAROUSEL
========================= */

const testimonialCards = document.querySelectorAll(".testimonial-card");
const testimonialPrev = document.getElementById("testimonial-prev");
const testimonialNext = document.getElementById("testimonial-next");
const testimonialDots = document.getElementById("testimonial-dots");

let currentTestimonial = 0;


// Create carousel dots

if (testimonialDots && testimonialCards.length > 0) {
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "testimonial-dot";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);

    dot.addEventListener("click", () => {
      currentTestimonial = index;
      updateTestimonials();
    });

    testimonialDots.appendChild(dot);
  });
}


// Update mobile testimonial

function updateTestimonials() {
  if (testimonialCards.length === 0) return;

  testimonialCards.forEach((card, index) => {
    card.classList.toggle(
      "active",
      index === currentTestimonial
    );
  });

  const dots = testimonialDots
    ? testimonialDots.querySelectorAll(".testimonial-dot")
    : [];

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentTestimonial
    );
  });
}


// Previous testimonial

if (testimonialPrev) {
  testimonialPrev.addEventListener("click", () => {
    currentTestimonial =
      (currentTestimonial - 1 + testimonialCards.length) %
      testimonialCards.length;

    updateTestimonials();
  });
}


// Next testimonial

if (testimonialNext) {
  testimonialNext.addEventListener("click", () => {
    currentTestimonial =
      (currentTestimonial + 1) %
      testimonialCards.length;

    updateTestimonials();
  });
}


// Initialize

updateTestimonials();
/* =========================
   J. FAQ ACCORDION
========================= */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {

  const question = item.querySelector(".faq-question");

  if (!question) return;

  question.addEventListener("click", () => {

    const isOpen = item.classList.contains("open");

    // Close all other FAQ items
    faqItems.forEach((otherItem) => {

      if (otherItem !== item) {

        otherItem.classList.remove("open");

        const otherQuestion =
          otherItem.querySelector(".faq-question");

        if (otherQuestion) {
          otherQuestion.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      }

    });


    // Toggle selected FAQ
    item.classList.toggle("open", !isOpen);

    question.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

  });

});