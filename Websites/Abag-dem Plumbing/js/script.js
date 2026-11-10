/* =========================================================
   NAVIGATION MENU
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNavigation = document.getElementById("mainNavigation");

if (menuToggle && mainNavigation) {

    menuToggle.addEventListener("click", function () {

        const isOpen =
            mainNavigation.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close menu"
                : "Open menu"
        );
    });


    mainNavigation
        .querySelectorAll(".nav-link")
        .forEach(function (link) {

            link.addEventListener("click", function () {

                mainNavigation.classList.remove("active");

                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            });

        });
}


/* =========================================================
   QUOTE MODAL
   ========================================================= */

const quoteButton =
    document.getElementById("quoteButton");

const quoteModal =
    document.getElementById("quoteModal");

const quoteModalClose =
    document.getElementById("quoteModalClose");

const quoteModalOverlay =
    document.getElementById("quoteModalOverlay");


/* =========================================================
   OPEN QUOTE MODAL
   ========================================================= */

function openQuoteModal() {

    if (!quoteModal) {
        return;
    }

    quoteModal.classList.add("active");

    quoteModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE QUOTE MODAL
   ========================================================= */

function closeQuoteModal() {

    if (!quoteModal) {
        return;
    }

    quoteModal.classList.remove("active");

    quoteModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================================
   ORIGINAL NAVBAR QUOTE BUTTON
   ========================================================= */

if (quoteButton) {

    quoteButton.addEventListener(
        "click",
        openQuoteModal
    );

}


/* =========================================================
   ALL "GET FREE QUOTE" BUTTONS
   ========================================================= */

document
    .querySelectorAll("[data-open-quote]")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                openQuoteModal();

            }
        );

    });


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

if (quoteModalClose) {

    quoteModalClose.addEventListener(
        "click",
        closeQuoteModal
    );

}


/* =========================================================
   MODAL OVERLAY
   ========================================================= */

if (quoteModalOverlay) {

    quoteModalOverlay.addEventListener(
        "click",
        closeQuoteModal
    );

}


/* =========================================================
   CLOSE MODAL WITH ESCAPE
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            quoteModal &&
            quoteModal.classList.contains("active")
        ) {

            closeQuoteModal();

        }

    }
);


/* =========================================================
   SERVICE QUOTE BUTTONS
   ========================================================= */

document
    .querySelectorAll(".service-quote-btn")
    .forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const selectedService =
                    this.getAttribute("data-service");


                window.selectedQuoteService =
                    selectedService;


                /*
                 * Open the quote form.
                 */

                openQuoteModal();


                /*
                 * Find the service field.
                 */

                const serviceField =
                    document.querySelector(
                        '[name="service"]'
                    );


                /*
                 * Automatically insert the
                 * selected service.
                 */

                if (serviceField && selectedService) {

                    serviceField.value =
                        selectedService;

                }

            }
        );

    });


/* =========================================================
   QUOTE FORM
   ========================================================= */

const quoteForm =
    document.getElementById("quoteForm");


if (quoteForm) {

    quoteForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const formData =
                new FormData(quoteForm);


            const name =
                formData.get("name");

            const phone =
                formData.get("phone");

            const email =
                formData.get("email");

            const service =
                formData.get("service");

            const location =
                formData.get("location");

            const message =
                formData.get("message");


            const subject =
                encodeURIComponent(
                    "New Website Enquiry - Abag-dem Plumbing Gh"
                );


            const body =
                encodeURIComponent(
`Hello Abag-dem Plumbing Gh,

I would like to make an enquiry.

Name: ${name}
Phone: ${phone}
Email: ${email}
Service Needed: ${service}
Location: ${location}

Message:
${message}`
                );


            window.location.href =
                `mailto:piersalleabagdem@gmail.com?subject=${subject}&body=${body}`;


            quoteForm.reset();

            closeQuoteModal();

        }
    );

}


/* =========================================================
   TESTIMONIAL SLIDER
   ========================================================= */

const testimonialSlides =
    document.querySelectorAll(".testimonial-slide");

const testimonialDots =
    document.querySelectorAll(".testimonial-dot");

const testimonialPrev =
    document.querySelector(".testimonial-prev");

const testimonialNext =
    document.querySelector(".testimonial-next");

let currentTestimonial = 0;
let testimonialTimer;


function showTestimonial(index) {

    if (!testimonialSlides.length) {
        return;
    }


    if (index < 0) {
        index =
            testimonialSlides.length - 1;
    }


    if (index >= testimonialSlides.length) {
        index = 0;
    }


    currentTestimonial = index;


    testimonialSlides.forEach(
        function (slide, slideIndex) {

            slide.classList.toggle(
                "is-active",
                slideIndex === currentTestimonial
            );

        }
    );


    testimonialDots.forEach(
        function (dot, dotIndex) {

            dot.classList.toggle(
                "is-active",
                dotIndex === currentTestimonial
            );

        }
    );

}


function nextTestimonial() {

    showTestimonial(
        currentTestimonial + 1
    );

    restartTestimonialTimer();

}


function previousTestimonial() {

    showTestimonial(
        currentTestimonial - 1
    );

    restartTestimonialTimer();

}


function restartTestimonialTimer() {

    clearInterval(
        testimonialTimer
    );


    testimonialTimer =
        setInterval(
            function () {

                showTestimonial(
                    currentTestimonial + 1
                );

            },
            6000
        );

}


if (testimonialNext) {

    testimonialNext.addEventListener(
        "click",
        nextTestimonial
    );

}


if (testimonialPrev) {

    testimonialPrev.addEventListener(
        "click",
        previousTestimonial
    );

}


testimonialDots.forEach(
    function (dot, index) {

        dot.addEventListener(
            "click",
            function () {

                showTestimonial(index);

                restartTestimonialTimer();

            }
        );

    }
);


if (testimonialSlides.length) {

    showTestimonial(0);

    restartTestimonialTimer();

}


/* =========================================================
   FAQ ACCORDION
   ========================================================= */

const faqQuestions =
    document.querySelectorAll(
        ".faq-question"
    );


faqQuestions.forEach(
    function (question) {

        question.addEventListener(
            "click",
            function () {

                const currentItem =
                    question.closest(
                        ".faq-item"
                    );


                const isCurrentlyOpen =
                    currentItem.classList.contains(
                        "is-open"
                    );


                document
                    .querySelectorAll(
                        ".faq-item"
                    )
                    .forEach(
                        function (item) {

                            item.classList.remove(
                                "is-open"
                            );


                            const button =
                                item.querySelector(
                                    ".faq-question"
                                );


                            if (button) {

                                button.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                            }

                        }
                    );


                if (!isCurrentlyOpen) {

                    currentItem.classList.add(
                        "is-open"
                    );


                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    }
);



/* =========================================================
   PROJECTS GALLERY
   SMOOTH SEE MORE / SHOW LESS
   ========================================================= */

const projectsSeeMore =
    document.getElementById("projectsSeeMore");

const hiddenProjects =
    document.querySelectorAll(".project-hidden");


if (projectsSeeMore && hiddenProjects.length > 0) {

    projectsSeeMore.addEventListener("click", function () {

        const isShowingMore =
            projectsSeeMore.getAttribute("aria-expanded") === "true";


        if (isShowingMore) {

            /* CLOSE */

            hiddenProjects.forEach(function (project) {

                project.classList.remove(
                    "project-visible"
                );

            });

            projectsSeeMore.textContent =
                "See More Projects";

            projectsSeeMore.setAttribute(
                "aria-expanded",
                "false"
            );


        } else {

            /* OPEN */

            hiddenProjects.forEach(function (project) {

                project.classList.add(
                    "project-visible"
                );

            });

            projectsSeeMore.textContent =
                "Show Less Projects";

            projectsSeeMore.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

}
/* =========================================================
   HERO GET FREE QUOTE BUTTON
   ========================================================= */

const heroQuoteButton =
    document.getElementById("heroQuoteBtn");


if (heroQuoteButton) {

    heroQuoteButton.addEventListener(
        "click",
        openQuoteModal
    );

}