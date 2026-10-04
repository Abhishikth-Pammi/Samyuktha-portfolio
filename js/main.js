/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const header = document.getElementById("site-header");

function updateHeader() {
    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);
updateHeader();



/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton = document.getElementById("mobile-menu-button");
const navLinksContainer = document.getElementById("nav-links");
const navLinks = document.querySelectorAll(".nav-link");


menuButton.addEventListener("click", () => {
    const isOpen = navLinksContainer.classList.toggle("open");

    menuButton.classList.toggle("open", isOpen);

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    document.body.classList.toggle(
        "menu-open",
        isOpen
    );
});


navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinksContainer.classList.remove("open");
        menuButton.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove("menu-open");
    });
});



/* =========================================================
   ALL GALLERY SLIDERS
   Works for:
   - research
   - projects
   - experience
========================================================= */

const galleries = document.querySelectorAll("[data-gallery]");


galleries.forEach((gallery) => {

    const slides = gallery.querySelectorAll(".gallery-slide");
    const nextButton = gallery.querySelector(".gallery-next");
    const previousButton = gallery.querySelector(".gallery-prev");
    const counter = gallery.querySelector(".gallery-counter");

    let currentIndex = 0;


    function updateGallery() {

        slides.forEach((slide, index) => {
            slide.classList.toggle(
                "active",
                index === currentIndex
            );
        });


        if (counter) {

            const current =
                String(currentIndex + 1).padStart(2, "0");

            const total =
                String(slides.length).padStart(2, "0");


            counter.textContent =
                `${current} / ${total}`;
        }

    }


    if (nextButton) {

        nextButton.addEventListener("click", () => {

            currentIndex =
                (currentIndex + 1) % slides.length;

            updateGallery();

        });

    }


    if (previousButton) {

        previousButton.addEventListener("click", () => {

            currentIndex =
                (currentIndex - 1 + slides.length)
                % slides.length;

            updateGallery();

        });

    }



    /* MOBILE SWIPE */

    let touchStartX = 0;
    let touchEndX = 0;


    gallery.addEventListener(
        "touchstart",
        (event) => {
            touchStartX =
                event.changedTouches[0].screenX;
        },
        { passive: true }
    );


    gallery.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();

        },
        { passive: true }
    );


    function handleSwipe() {

        const distance =
            touchStartX - touchEndX;


        if (Math.abs(distance) < 50) {
            return;
        }


        if (distance > 0) {

            currentIndex =
                (currentIndex + 1)
                % slides.length;

        } else {

            currentIndex =
                (currentIndex - 1 + slides.length)
                % slides.length;

        }


        updateGallery();
    }


    updateGallery();

});



/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealItems =
    document.querySelectorAll(".reveal");


const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (reducedMotion) {

    revealItems.forEach((item) => {
        item.classList.add("visible");
    });

} else {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealItems.forEach((item) => {
        revealObserver.observe(item);
    });

}



/* =========================================================
   ACTIVE NAV SECTION
========================================================= */

const sections =
    document.querySelectorAll("main section[id]");


const activeNavObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }


                const sectionId =
                    entry.target.getAttribute("id");


                navLinks.forEach((link) => {

                    const href =
                        link.getAttribute("href");

                    link.classList.toggle(
                        "active",
                        href === `#${sectionId}`
                    );

                });

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );


sections.forEach((section) => {
    activeNavObserver.observe(section);
});



/* =========================================================
   FOOTER YEAR
========================================================= */

const yearElement =
    document.getElementById("current-year");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}

/* =========================================================
   IMAGE GALLERIES
========================================================= */

document.querySelectorAll(".gallery").forEach((gallery) => {

    const slides = gallery.querySelectorAll(".gallery-slide");
    const prevButton = gallery.querySelector(".gallery-prev");
    const nextButton = gallery.querySelector(".gallery-next");
    const counter = gallery.querySelector(".gallery-counter");

    let currentSlide = 0;

    function showSlide(index) {

        if (slides.length === 0) return;

        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle(
                "active",
                slideIndex === currentSlide
            );
        });

        if (counter) {
            counter.textContent =
                `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }
    }


    if (prevButton) {
        prevButton.addEventListener("click", () => {
            showSlide(currentSlide - 1);
        });
    }


    if (nextButton) {
        nextButton.addEventListener("click", () => {
            showSlide(currentSlide + 1);
        });
    }


    showSlide(0);
});


/* =========================================================
   VIDEO MODAL
========================================================= */

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");

const modalCloseButton =
    document.querySelector(".video-modal-close");

const modalBackdrop =
    document.querySelector(".video-modal-backdrop");


function openVideoModal(videoSource) {

    if (!videoModal || !modalVideo) return;

    modalVideo.src = videoSource;

    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    modalVideo.play().catch(() => {
        // Browser may require user interaction.
    });
}


function closeVideoModal() {

    if (!videoModal || !modalVideo) return;

    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");

    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.removeAttribute("src");
    modalVideo.load();

    document.body.style.overflow = "";
}


/* Open video */
document
    .querySelectorAll(".video-play-button")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const videoSource =
                button.dataset.video;

            if (videoSource) {
                openVideoModal(videoSource);
            }

        });

    });


/* X button */
if (modalCloseButton) {

    modalCloseButton.addEventListener(
        "click",
        closeVideoModal
    );

}


/* Click dark background */
if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeVideoModal
    );

}


/* Escape key */
document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        videoModal?.classList.contains("open")
    ) {
        closeVideoModal();
    }

});