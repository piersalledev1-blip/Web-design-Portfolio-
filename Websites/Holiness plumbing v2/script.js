/* ========================================
   MOBILE NAVIGATION
======================================== */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

const mobileLinks = document.querySelectorAll(".mobile-nav a");
const desktopLinks = document.querySelectorAll(".desktop-nav a");

const allNavLinks = document.querySelectorAll(
  ".desktop-nav a, .mobile-nav a"
);


/* ========================================
   MOBILE MENU
======================================== */

function openMenu() {

  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.add("open");

  mobileMenu.classList.add("active");

  document.body.classList.add("menu-open");

  menuToggle.setAttribute("aria-expanded", "true");

  menuToggle.setAttribute(
    "aria-label",
    "Close navigation menu"
  );

  mobileMenu.setAttribute("aria-hidden", "false");
}


function closeMenu() {

  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.remove("open");

  mobileMenu.classList.remove("active");

  document.body.classList.remove("menu-open");

  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  mobileMenu.setAttribute("aria-hidden", "true");
}


/* ========================================
   MENU TOGGLE
======================================== */

if (menuToggle && mobileMenu) {

  menuToggle.addEventListener("click", () => {

    if (mobileMenu.classList.contains("active")) {

      closeMenu();

    } else {

      openMenu();

    }

  });

}


/* ========================================
   NAVIGATION ACTIVE STATE
======================================== */

function setActiveSection(sectionId) {

  allNavLinks.forEach(link => {

    const linkTarget = link.getAttribute("href");

    if (linkTarget === `#${sectionId}`) {

      link.classList.add("active");

    } else {

      link.classList.remove("active");

    }

  });

}


/* ========================================
   CLICK NAVIGATION
======================================== */

allNavLinks.forEach(link => {

  link.addEventListener("click", () => {

    const target = link.getAttribute("href");

    if (target && target.startsWith("#")) {

      const sectionId = target.substring(1);

      setActiveSection(sectionId);

    }

  });

});


/* ========================================
   CLOSE MOBILE MENU AFTER CLICK
======================================== */

mobileLinks.forEach(link => {

  link.addEventListener("click", () => {

    closeMenu();

  });

});


/* ========================================
   DETECT CURRENT SECTION WHILE SCROLLING
======================================== */

const sections = document.querySelectorAll(
  "#home, #about, #services, #projects, #why-us, #contact"
);


function updateActiveSection() {

  if (!sections.length) return;

  const scrollPosition =
    window.scrollY + (window.innerHeight * 0.35);

  let currentSection = sections[0].id;

  sections.forEach(section => {

    const sectionTop = section.offsetTop;

    if (scrollPosition >= sectionTop) {

      currentSection = section.id;

    }

  });

  setActiveSection(currentSection);
}


/* ========================================
   SCROLL LISTENER
======================================== */

window.addEventListener(
  "scroll",
  updateActiveSection,
  { passive: true }
);


/* ========================================
   INITIAL ACTIVE SECTION
======================================== */

updateActiveSection();


/* ========================================
   CLOSE MENU WITH ESCAPE
======================================== */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    closeMenu(); 

  }

});


/* ========================================
   CLOSE MENU WHEN RETURNING TO DESKTOP
======================================== */

window.addEventListener("resize", () => {

  if (window.innerWidth > 900) {

    closeMenu();

  }

});

document.addEventListener('DOMContentLoaded', function () {

  const image = document.getElementById('featured-project-image');
  const title = document.getElementById('featured-project-title');
  const location = document.getElementById('featured-project-location');

  const previous = document.getElementById('featured-project-prev');
  const next = document.getElementById('featured-project-next');

  const dots = document.querySelectorAll('.featured-project-dot');
  const slider = document.querySelector('.featured-projects-slider');

  if (!image || !title || !location || !previous || !next || !slider) {
    return;
  }

  const projects = [
    {
      image: 'assets/01.png',
      title: 'Luxury Bathroom Installation',
      location: 'East Legon, Accra'
    },
    {
      image: 'assets/02.png',
      title: 'Bathroom Renovation',
      location: 'Accra, Ghana'
    },
    {
      image: 'assets/03.png',
      title: 'Biodigester Installation',
      location: 'Kumasi, Ghana'
    },
    {
      image: 'assets/04.png',
      title: 'Plumbing Pipe Installation',
      location: 'Madina, Accra'
    },
    {
      image: 'assets/05.png',
      title: 'Commercial Laundry Project',
      location: 'Ghana'
    }
  ];

  let currentIndex = 0;
  let touchStartX = 0;

  function showProject(index) {

    currentIndex =
      (index + projects.length) % projects.length;

    const project = projects[currentIndex];

    image.src = project.image;
    image.alt = project.title;

    title.textContent = project.title;
    location.textContent = project.location;

    dots.forEach(function (dot, dotIndex) {

      dot.classList.toggle(
        'active',
        dotIndex === currentIndex
      );

    });
  }


  previous.addEventListener('click', function () {
    showProject(currentIndex - 1);
  });


  next.addEventListener('click', function () {
    showProject(currentIndex + 1);
  });


  dots.forEach(function (dot, index) {

    dot.addEventListener('click', function () {
      showProject(index);
    });

  });


  /* SWIPE */

  slider.addEventListener(
    'touchstart',
    function (event) {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    { passive: true }
  );


  slider.addEventListener(
    'touchend',
    function (event) {

      const touchEndX =
        event.changedTouches[0].screenX;

      const distance =
        touchEndX - touchStartX;

      if (Math.abs(distance) < 45) {
        return;
      }

      if (distance < 0) {
        showProject(currentIndex + 1);
      } else {
        showProject(currentIndex - 1);
      }

    },
    { passive: true }
  );


  showProject(0);

});

/* =========================================
   HOLINESS TRUST STRIP
   ANIMATED COUNTERS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const stats = document.querySelectorAll(
    ".holiness-trust-stat"
  );

  const counters = document.querySelectorAll(
    ".holiness-counter"
  );


  /* =========================================
     FADE-IN STATS
  ========================================= */

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.2
    }
  );


  stats.forEach((stat) => {
    statsObserver.observe(stat);
  });


  /* =========================================
     COUNTER ANIMATION
  ========================================= */

  const animateCounter = (counter) => {

    const target = Number(
      counter.dataset.count
    );

    const duration = 2000;
    const startTime = performance.now();


    const easeOutQuart = (progress) => {
      return 1 - Math.pow(1 - progress, 4);
    };


    const update = (currentTime) => {

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const value = Math.floor(
        easeOutQuart(progress) * target
      );

      counter.textContent = value;


      if (progress < 1) {

        requestAnimationFrame(update);

      } else {

        counter.textContent = target;

      }

    };


    requestAnimationFrame(update);

  };


  /* =========================================
     TRIGGER COUNTER ON SCROLL
  ========================================= */

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        animateCounter(entry.target);

        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.5
    }
  );


  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

});