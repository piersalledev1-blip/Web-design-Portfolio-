/* =========================================================
   NEXT GEN — FAQ JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        item.addEventListener("toggle", () => {

            if (!item.open) {
                return;
            }

            faqItems.forEach((otherItem) => {

                if (otherItem !== item) {
                    otherItem.removeAttribute("open");
                }

            });

        });

    });

});