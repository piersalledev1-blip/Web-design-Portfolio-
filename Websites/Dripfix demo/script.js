/* =========================================
   DRIPFIX MOBILE NAVIGATION
========================================= */

const hamburger = document.querySelector(".hamburger");
const drawer = document.querySelector(".mobile-drawer");
const overlay = document.querySelector(".mobile-overlay");
const closeButton = document.querySelector(".drawer-close");
const mobileLinks = document.querySelectorAll(".mobile-nav a");


function openMenu() {
  hamburger.classList.add("open");
  drawer.classList.add("open");
  overlay.classList.add("open");

  hamburger.setAttribute("aria-expanded", "true");

  document.body.style.overflow = "hidden";
}


function closeMenu() {
  hamburger.classList.remove("open");
  drawer.classList.remove("open");
  overlay.classList.remove("open");

  hamburger.setAttribute("aria-expanded", "false");

  document.body.style.overflow = "";
}


/* Hamburger */

hamburger.addEventListener("click", () => {

  if (drawer.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }

});


/* Close button */

closeButton.addEventListener("click", closeMenu);


/* Click outside drawer */

overlay.addEventListener("click", closeMenu);


/* Close after selecting a link */

mobileLinks.forEach((link) => {

  link.addEventListener("click", closeMenu);

});


/* Escape key */

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {
    closeMenu();
  }

});
/* =========================
   SECTION 10 — FINAL JS
========================= */

// Automatically update the footer copyright year
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}
