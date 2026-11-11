/* =========================================================
   ABRANTYIE DIGITAL — HOMEPAGE
   script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     NAVIGATION ACTIVE STATE
     ------------------------------------------------------- */

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {

    link.addEventListener("click", () => {

      navLinks.forEach((navLink) => {
        navLink.classList.remove("active");
        navLink.removeAttribute("aria-current");
      });

      link.classList.add("active");
      link.setAttribute("aria-current", "page");

    });

  });


  /* -------------------------------------------------------
     HERO ENTRANCE ANIMATION
     ------------------------------------------------------- */

  const heroContent = document.querySelector(".hero-content");

  if (heroContent) {

    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(20px)";
    heroContent.style.transition =
      "opacity 0.8s ease, transform 0.8s ease";

    requestAnimationFrame(() => {
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    });

  }

});
document.querySelectorAll(".what-item").forEach(item => {

  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateX(4px)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateX(0)";
  });
 
});
document.addEventListener("DOMContentLoaded", () => {

  const processSection = document.querySelector(".process");
  const processList = document.querySelector(".process-list");
  const steps = document.querySelectorAll(".process-step");
  const ownership = document.querySelector(".process-ownership");

  if(!processSection || !processList) return;


  /* =========================
     STEP SCROLL ANIMATION
  ========================= */

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);

      }

    });

  },{
    threshold:0.18,
    rootMargin:"0px 0px -40px 0px"
  });


  steps.forEach((step, index) => {

    step.style.transitionDelay = `${index * 70}ms`;

    observer.observe(step);

  });


  /* =========================
     TIMELINE REVEAL
  ========================= */

  const timelineObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        processList.classList.add("timeline-active");

        timelineObserver.unobserve(entry.target);

      }

    });

  },{
    threshold:0.1
  });


  timelineObserver.observe(processList);


  /* =========================
     OWNERSHIP REVEAL
  ========================= */

  const ownershipObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if(entry.isIntersecting){

        ownership.classList.add("visible");

        ownershipObserver.unobserve(entry.target);

      }

    });

  },{
    threshold:0.2 
  });


  ownershipObserver.observe(ownership);

});
document.addEventListener("DOMContentLoaded", () => {

  const label = document.querySelector(".why-label");
  const heading = document.querySelector(".why-heading");
  const items = document.querySelectorAll(".why-item");
  const closing = document.querySelector(".why-closing");


  if (!label || !heading || !closing) return;

  /* Intro animation */

  setTimeout(() => {
    label.style.opacity = "1";
    label.style.transform = "translateY(0)";
  }, 100);

  setTimeout(() => {
    heading.style.opacity = "1";
    heading.style.transform = "translateY(0)";
  }, 220);


  /* Scroll reveal */

  const observer = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach(entry => {

        if(entry.isIntersecting){

          if(entry.target.classList.contains("why-item")){
            entry.target.classList.add("visible");
          }

          if(entry.target.classList.contains("why-closing")){
            entry.target.classList.add("visible");
          }

          observer.unobserve(entry.target);
        }

      });

    },
    {
      threshold:0.15
    }
  );


  items.forEach(item => {
    observer.observe(item);
  });

  observer.observe(closing);


  /* Subtle number movement on desktop */

  if(window.matchMedia("(pointer:fine)").matches){

    items.forEach(item => {

      item.addEventListener("mousemove", event => {

        const rect = item.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        const number = item.querySelector(".why-number");

        number.style.transform =
          `translate(${x * -8}px, ${y * -6}px)`;

      });


      item.addEventListener("mouseleave", () => {

        const number = item.querySelector(".why-number");

        number.style.transform = "translate(0, 0)";

      });

    });

  }

});