const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const closeMenu = document.querySelector(".close-menu");
const mobileLinks = document.querySelectorAll(".mobile-links a");

menuToggle.addEventListener("click", function () {

    mobileMenu.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");

});

closeMenu.addEventListener("click", function () {

    mobileMenu.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");

});

mobileLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        mobileMenu.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

    });

});

const workItems = document.querySelectorAll(".work-item");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox img");
const lightboxClose = document.querySelector(".lightbox-close");


workItems.forEach(function(item) {

    item.addEventListener("click", function() {

        const image = item.querySelector("img");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");

    });

});


lightboxClose.addEventListener("click", function() {

    lightbox.classList.remove("active");

});


lightbox.addEventListener("click", function(event) {

    if (event.target === lightbox) {

        lightbox.classList.remove("active");

    }

});


document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        lightbox.classList.remove("active");

    }

});<section class="faq" id="faq">

    <div class="faq-container">

        <div class="faq-heading">

            <span class="faq-label">
                FAQ
            </span>

            <h2>
                Questions you may have.
            </h2>

        </div>

        <div class="faq-list">

            <article class="faq-item">

                <button class="faq-question" type="button">
                    <span>
                        What types of electrical work do you handle?
                    </span>

                    <span class="faq-icon">+</span>
                </button>

                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <p>
                            We handle house wiring, rewiring,
                            lighting, electrical faults, sockets
                            and switches, new building installations,
                            and inverter and backup power setups.
                        </p>
                    </div>
                </div>

            </article>

            <article class="faq-item">

                <button class="faq-question" type="button">
                    <span>
                        Do you work on both houses and businesses?
                    </span>

                    <span class="faq-icon">+</span>
                </button>

                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <p>
                            Yes. We handle electrical work for
                            homes, shops, offices, and other
                            building projects.
                        </p>
                    </div>
                </div>

            </article>

            <article class="faq-item">

                <button class="faq-question" type="button">
                    <span>
                        Can you inspect an existing electrical system?
                    </span>

                    <span class="faq-icon">+</span>
                </button>

                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <p>
                            Yes. If you have concerns about old
                            wiring, faults, or electrical safety,
                            you can contact us to discuss an
                            inspection.
                        </p>
                    </div>
                </div>

            </article>

            <article class="faq-item">

                <button class="faq-question" type="button">
                    <span>
                        How do I get a quote?
                    </span>

                    <span class="faq-icon">+</span>
                </button>

                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <p>
                            Send us a message on WhatsApp with
                            your location and what you need done.
                            We will discuss the work and the
                            next steps with you.
                        </p>
                    </div>
                </div>

            </article>

            <article class="faq-item">

                <button class="faq-question" type="button">
                    <span>
                        Can I contact you about an urgent electrical problem?
                    </span>

                    <span class="faq-icon">+</span>
                </button>

                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <p>
                            Yes. Send a WhatsApp message or call
                            and explain the problem so we can
                            advise you on the next step.
                        </p>
                    </div>
                </div>

            </article>

            <article class="faq-item">

                <button class="faq-question" type="button">
                    <span>
                        Do you cover my area?
                    </span>

                    <span class="faq-icon">+</span>
                </button>

                <div class="faq-answer">
                    <div class="faq-answer-inner">
                        <p>
                            Send us your location on WhatsApp and
                            we will confirm whether we can take
                            on the work in your area.
                        </p>
                    </div>
                </div>

            </article>

        </div>

    </div>

</section>


<section class="final-cta">

    <div class="cta-container">

        <h2>
            Need a reliable electrician? Let's talk.
        </h2>

        <p>
            Send a message on WhatsApp with your location and
            what you need. You will get a quick response and
            clear next steps.
        </p>

        <div class="cta-buttons">

            <a
                href="https://wa.me/233559411844?text=Hello%20boss%2C%20I%20saw%20your%20work%20online.%20I%20need%20an%20electrician."
                class="cta-button cta-whatsapp"
            >
                Chat on WhatsApp
            </a>

            <a
                href="tel:+233559411844"
                class="cta-button cta-call"
            >
                Call 055 941 1844
            </a>

        </div>

    </div>

</section>


<div class="floating-contact">

    <a
        href="https://wa.me/233559411844?text=Hello%20boss%2C%20I%20need%20an%20electrician."
        class="floating-button floating-whatsapp"
        aria-label="Chat on WhatsApp"
    >

        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .23 5.32.23 11.86c0 2.09.55 4.13 1.59 5.92L.13 24l6.36-1.67a11.82 11.82 0 0 0 5.59 1.42h.01c6.53 0 11.84-5.32 11.84-11.86 0-3.16-1.23-6.13-3.43-8.39ZM12.09 21.7h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.77.99 1.01-3.67-.23-.38a9.84 9.84 0 0 1-1.51-5.2c0-5.42 4.42-9.83 9.85-9.83 2.63 0 5.1 1.03 6.96 2.89a9.78 9.78 0 0 1 2.88 6.98c0 5.42-4.41 9.83-9.81 9.83Zm5.4-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z"
                fill="currentColor"
            />
        </svg>

    </a>


    <a
        href="tel:+233559411844"
        class="floating-button floating-call"
        aria-label="Call Abagdem Electricals"
    >

        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M6.62 10.79a15.46 15.46 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"
                fill="currentColor"
            />
        </svg>

    </a>

</div>