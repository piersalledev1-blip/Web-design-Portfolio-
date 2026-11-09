(function () {
  "use strict";

  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("mobileMenu");
  var toast = null;
  var toastTimer = null;

  function closeMenu() {
    if (!menu || !toggle) return;
    var wasOpen = menu.classList.contains("open");
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    toggle.classList.remove("active");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    if (wasOpen) toggle.focus();
  }

  function openMenu() {
    if (!menu || !toggle) return;
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    toggle.classList.add("active");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    var firstLink = menu.querySelector("a");
    if (firstLink) firstLink.focus();
  }

  if (toggle && menu) {
    menu.setAttribute("aria-hidden", "true");

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }


  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('a[href^="#"]:not([data-booking-link])').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (history.replaceState) {
        history.replaceState(null, "", targetId);
      }
    });
  });
})();
