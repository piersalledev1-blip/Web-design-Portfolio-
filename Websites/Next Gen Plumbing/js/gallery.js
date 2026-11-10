/* =========================================================
   NEXT GEN — GALLERY JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       GALLERY FILTERS
       ===================================================== */

    const filters =
        document.querySelectorAll(".gallery-filter");

    const items =
        document.querySelectorAll(".gallery-item");


    if (!filters.length || !items.length) {
        return;
    }


    let currentFilter = "all";


    filters.forEach((filter) => {

        filter.addEventListener("click", () => {

            const selectedFilter =
                filter.dataset.filter;


            /*
               Prevent unnecessary animation
               when clicking the already-active
               category.
            */

            if (selectedFilter === currentFilter) {
                return;
            }


            currentFilter = selectedFilter;


            /* ---------------------------------------------
               UPDATE ACTIVE FILTER
               --------------------------------------------- */

            filters.forEach((button) => {

                const isActive =
                    button === filter;

                button.classList.toggle(
                    "active",
                    isActive
                );

                button.setAttribute(
                    "aria-selected",
                    isActive ? "true" : "false"
                );

            });


            /* ---------------------------------------------
               FIRST PHASE — EXIT
               --------------------------------------------- */

            items.forEach((item) => {

                item.classList.remove(
                    "is-entering"
                );

                item.classList.add(
                    "is-exiting"
                );

            });


            /*
               Give the exit animation time to finish
               before changing the visible items.
            */

            window.setTimeout(() => {


                /* -----------------------------------------
                   SECOND PHASE — FILTER
                   ----------------------------------------- */

                items.forEach((item) => {

                    const category =
                        item.dataset.category;


                    const shouldShow =
                        selectedFilter === "all" ||
                        category === selectedFilter;


                    if (shouldShow) {

                        item.classList.remove(
                            "is-hidden"
                        );

                    } else {

                        item.classList.add(
                            "is-hidden"
                        );

                    }

                });


                /*
                   Force the browser to recognise
                   the new layout before starting
                   the entrance animation.
                */

                requestAnimationFrame(() => {

                    requestAnimationFrame(() => {


                        /* ---------------------------------
                           THIRD PHASE — ENTER
                           --------------------------------- */

                        items.forEach((item) => {

                            if (
                                !item.classList.contains(
                                    "is-hidden"
                                )
                            ) {

                                item.classList.remove(
                                    "is-exiting"
                                );

                                item.classList.add(
                                    "is-entering"
                                );

                            }

                        });

                    });

                });


            }, 450);

        });

    });


    /* =====================================================
       REMOVE ENTER ANIMATION CLASS
       ===================================================== */

    items.forEach((item) => {

        item.addEventListener(
            "animationend",
            () => {

                item.classList.remove(
                    "is-entering"
                );

            }
        );

    });

});