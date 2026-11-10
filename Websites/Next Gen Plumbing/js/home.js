/* =========================================================
   TRUST STATISTICS — COUNT UP
   ========================================================= */

const trustSection =
    document.querySelector(".trust-section");


const trustNumbers =
    document.querySelectorAll(".trust-number");


if (
    trustSection &&
    trustNumbers.length &&
    "IntersectionObserver" in window
) {

    let hasAnimated = false;


    const animateTrustNumbers = () => {

        if (hasAnimated) return;

        hasAnimated = true;


        trustNumbers.forEach((number) => {

            const target =
                Number(number.dataset.target);


            const suffix =
                number.dataset.suffix || "";


            const duration = 1500;

            const startTime =
                performance.now();


            const updateNumber = (currentTime) => {

                const elapsed =
                    currentTime - startTime;


                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );


                /*
                   Smooth ease-out motion.
                */

                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                const currentValue =
                    Math.floor(
                        eased * target
                    );


                number.textContent =
                    currentValue + suffix;


                if (progress < 1) {

                    requestAnimationFrame(
                        updateNumber
                    );

                } else {

                    number.textContent =
                        target + suffix;

                }

            };


            requestAnimationFrame(
                updateNumber
            );

        });

    };


    const trustObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        animateTrustNumbers();

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.25
            }
        );


    trustObserver.observe(
        trustSection
    );

}
/* =========================================================
   TESTIMONIAL CAROUSEL
   ========================================================= */

const testimonialCarousel =
    document.getElementById("testimonialsCarousel");

const testimonialCards =
    document.querySelectorAll(".testimonial-card");

const testimonialPrev =
    document.getElementById("testimonialPrev");

const testimonialNext =
    document.getElementById("testimonialNext");

const testimonialDots =
    document.getElementById("testimonialDots");

let testimonialIndex = 0;

const testimonialTotal = testimonialCards.length;


/* ---------------------------------------------------------
   CREATE DOTS
--------------------------------------------------------- */

testimonialCards.forEach((_, index) => {

    const dot = document.createElement("button");

    dot.className = "testimonial-dot";

    dot.setAttribute(
        "aria-label",
        `Show testimonial ${index + 1}`
    );

    dot.addEventListener("click", () => {
        testimonialIndex = index;
        updateTestimonials();
        restartTestimonialAutoplay();
    });

    testimonialDots.appendChild(dot);

});


/* ---------------------------------------------------------
   UPDATE CAROUSEL
--------------------------------------------------------- */

function updateTestimonials() {

    const isMobile = window.innerWidth <= 768;
    const dots =
        document.querySelectorAll(".testimonial-dot");

    testimonialCards.forEach((card, index) => {

        let offset = index - testimonialIndex;

        /*
         * Wrap the carousel so the first and last cards
         * behave like a continuous wheel.
         */

        if (offset > testimonialTotal / 2) {
            offset -= testimonialTotal;
        }

        if (offset < -testimonialTotal / 2) {
            offset += testimonialTotal;
        }

        const absoluteOffset = Math.abs(offset);

        let translateX;
        let translateZ;
        let rotateY;
        let scale;
        let opacity;
        let zIndex;
        let blur;


        /* ---------------------------------------------
           CENTER CARD
        --------------------------------------------- */

        if (absoluteOffset === 0) {

            translateX = 0;
            translateZ = 0;
            rotateY = 0;
            scale = 1;
            opacity = 1;
            zIndex = 10;
            blur = 0;

        }


        /* ---------------------------------------------
           NEIGHBOURING CARDS
        --------------------------------------------- */

        else if (absoluteOffset === 1) {

            if (isMobile) {
                translateX = offset * 225;
                translateZ = -160;
                rotateY = offset > 0 ? -25 : 25;
                scale = 0.84;
                opacity = 0.7;
            } else {
                translateX = offset * 360;
                translateZ = -180;
                rotateY = offset > 0 ? -28 : 28;
                scale = 0.86;
                opacity = 0.72;
            }

            zIndex = 6;
            blur = 0;

        }


        /* ---------------------------------------------
           FURTHER CARDS
        --------------------------------------------- */

        else if (absoluteOffset === 2) {

            if (isMobile) {
                translateX = offset * 320;
                translateZ = -300;
                rotateY = offset > 0 ? -38 : 38;
                scale = 0.7;
                opacity = 0.3;
            } else {
                translateX = offset * 570;
                translateZ = -330;
                rotateY = offset > 0 ? -40 : 40;
                scale = 0.7;
                opacity = 0.35;
            }

            zIndex = 3;
            blur = 0.5;

        }


        /* ---------------------------------------------
           HIDDEN CARDS
        --------------------------------------------- */

        else {

            translateX = offset > 0 ? 700 : -700;
            translateZ = -500;
            rotateY = offset > 0 ? -45 : 45;
            scale = 0.5;
            opacity = 0;
            zIndex = 1;
            blur = 2;

        }


        card.style.transform = `
            translate(-50%, -50%)
            translateX(${translateX}px)
            translateZ(${translateZ}px)
            rotateY(${rotateY}deg)
            scale(${scale})
        `;

        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.style.filter = `blur(${blur}px)`;

    });


    /* -----------------------------------------------------
       UPDATE DOTS
    ----------------------------------------------------- */

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "active",
            index === testimonialIndex
        );

    });

}


/* ---------------------------------------------------------
   NEXT
--------------------------------------------------------- */

function nextTestimonial() {

    testimonialIndex =
        (testimonialIndex + 1) % testimonialTotal;

    updateTestimonials();

}


/* ---------------------------------------------------------
   PREVIOUS
--------------------------------------------------------- */

function previousTestimonial() {

    testimonialIndex =
        (testimonialIndex - 1 + testimonialTotal)
        % testimonialTotal;

    updateTestimonials();

}


/* ---------------------------------------------------------
   BUTTON EVENTS
--------------------------------------------------------- */

if (testimonialNext) {

    testimonialNext.addEventListener(
        "click",
        () => {

            nextTestimonial();
            restartTestimonialAutoplay();

        }
    );

}


if (testimonialPrev) {

    testimonialPrev.addEventListener(
        "click",
        () => {

            previousTestimonial();
            restartTestimonialAutoplay();

        }
    );

}


/* ---------------------------------------------------------
   AUTOPLAY
--------------------------------------------------------- */

let testimonialAutoplay;

function startTestimonialAutoplay() {

    testimonialAutoplay = setInterval(() => {

        nextTestimonial();

    }, 5500);

}


function restartTestimonialAutoplay() {

    clearInterval(testimonialAutoplay);

    startTestimonialAutoplay();

}


/* ---------------------------------------------------------
   PAUSE WHILE HOVERING
--------------------------------------------------------- */

if (testimonialCarousel) {

    testimonialCarousel.addEventListener(
        "mouseenter",
        () => {
            clearInterval(testimonialAutoplay);
        }
    );


    testimonialCarousel.addEventListener(
        "mouseleave",
        () => {
            startTestimonialAutoplay();
        }
    );

}


/* ---------------------------------------------------------
   TOUCH / SWIPE
--------------------------------------------------------- */

let testimonialTouchStartX = 0;
let testimonialTouchEndX = 0;


if (testimonialCarousel) {

    testimonialCarousel.addEventListener(
        "touchstart",
        (event) => {

            testimonialTouchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    testimonialCarousel.addEventListener(
        "touchend",
        (event) => {

            testimonialTouchEndX =
                event.changedTouches[0].screenX;

            handleTestimonialSwipe();

        },
        { passive: true }
    );

}


function handleTestimonialSwipe() {

    const swipeDistance =
        testimonialTouchEndX -
        testimonialTouchStartX;


    if (Math.abs(swipeDistance) < 50) {
        return;
    }


    if (swipeDistance < 0) {

        nextTestimonial();

    } else {

        previousTestimonial();

    }

    restartTestimonialAutoplay();

}


/* ---------------------------------------------------------
   KEYBOARD SUPPORT
--------------------------------------------------------- */

document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowLeft") {

        previousTestimonial();
        restartTestimonialAutoplay();

    }

    if (event.key === "ArrowRight") {

        nextTestimonial();
        restartTestimonialAutoplay();

    }

});


/* ---------------------------------------------------------
   RESPONSIVE UPDATE
--------------------------------------------------------- */

let testimonialResizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(testimonialResizeTimer);

    testimonialResizeTimer = setTimeout(() => {

        updateTestimonials();

    }, 200);

});


/* ---------------------------------------------------------
   INITIALIZE
--------------------------------------------------------- */

updateTestimonials();
startTestimonialAutoplay();

/* =========================================================
   NEXT GEN FAQ PREVIEW — ACCORDION
   ========================================================= */

const nextGenFaqItems =
    document.querySelectorAll(
        ".nextgen-faq-item"
    );


nextGenFaqItems.forEach((faqItem) => {

    const question =
        faqItem.querySelector(
            ".nextgen-faq-question"
        );


    if (!question) return;


    question.addEventListener("click", () => {

        const isActive =
            faqItem.classList.contains(
                "nextgen-faq-active"
            );


        /* Close all other FAQs */

        nextGenFaqItems.forEach((item) => {

            item.classList.remove(
                "nextgen-faq-active"
            );

        });


        /* Open selected FAQ */

        if (!isActive) {

            faqItem.classList.add(
                "nextgen-faq-active"
            );

        }

    });

});