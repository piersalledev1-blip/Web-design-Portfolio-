/* =========================================================
   NEXT GEN — GLOBAL JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";


    /* -----------------------------------------------------
       HOMEPAGE / NEXT GEN LOGO
       ----------------------------------------------------- */

    const navHome = document.querySelector(".nav-home");

    if (navHome) {

        if (currentPage === "index.html") {

            navHome.classList.add("active");

        } else {

            navHome.classList.remove("active");

        }

    }


    /* -----------------------------------------------------
       OTHER NAVIGATION LINKS
       ----------------------------------------------------- */

    const navLinks =
        document.querySelectorAll(".nav-link");


    navLinks.forEach((link) => {

        const linkPage =
            link.getAttribute("href");


        if (linkPage === currentPage) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });



    /* =====================================================
       FOOTER REVEAL ANIMATION
       ===================================================== */

    const footer =
        document.querySelector(".site-footer");


    if (
        footer &&
        "IntersectionObserver" in window
    ) {

        const footerObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            footer.classList.add(
                                "footer-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.10
                }
            );


        footerObserver.observe(footer);

    } else if (footer) {

        /*
           Fallback for browsers that do not support
           IntersectionObserver.
        */

        footer.classList.add(
            "footer-visible"
        );

    }

});