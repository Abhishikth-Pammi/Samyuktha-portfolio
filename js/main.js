
/* =========================================================
   SAI SAMYUKTHA PAMMI PORTFOLIO — INTERACTIONS
   Includes the updated 14-card Leadership & Impact modal.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    const header = document.getElementById("site-header");
    const menuButton = document.getElementById("mobile-menu-button");
    const navLinksContainer = document.getElementById("nav-links");
    const navLinks = Array.from(
        document.querySelectorAll(".nav-link")
    );

    function updateHeader() {
        header?.classList.toggle(
            "scrolled",
            window.scrollY > 30
        );
    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    menuButton?.addEventListener("click", () => {
        const isOpen =
            navLinksContainer?.classList.toggle("open") ??
            false;

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
            navLinksContainer?.classList.remove("open");
            menuButton?.classList.remove("open");

            menuButton?.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("menu-open");
        });
    });


    /* =====================================================
       IMAGE GALLERIES
    ===================================================== */

    const galleries = Array.from(
        document.querySelectorAll(".gallery")
    );

    function showSlide(gallery, requestedIndex) {
        const slides = Array.from(
            gallery.querySelectorAll(".gallery-slide")
        );

        if (!slides.length) return;

        const index =
            ((requestedIndex % slides.length) +
                slides.length) %
            slides.length;

        gallery.dataset.galleryIndex = String(index);

        slides.forEach((slide, slideIndex) => {
            const active = slideIndex === index;

            slide.classList.toggle("active", active);

            slide.setAttribute(
                "aria-hidden",
                String(!active)
            );
        });

        const counter = gallery.querySelector(
            ".gallery-counter"
        );

        if (counter) {
            counter.textContent =
                `${String(index + 1).padStart(2, "0")} / ` +
                `${String(slides.length).padStart(2, "0")}`;
        }
    }


    /* =====================================================
       INITIALISE GALLERIES + MOBILE SWIPE
    ===================================================== */

    galleries.forEach((gallery) => {
        const slides = Array.from(
            gallery.querySelectorAll(".gallery-slide")
        );

        const initial = Math.max(
            0,
            slides.findIndex((slide) =>
                slide.classList.contains("active")
            )
        );

        showSlide(gallery, initial);

        let startX = 0;

        gallery.addEventListener(
            "touchstart",
            (event) => {
                startX = event.changedTouches[0].screenX;
            },
            { passive: true }
        );

        gallery.addEventListener(
            "touchend",
            (event) => {
                const difference =
                    startX -
                    event.changedTouches[0].screenX;

                if (Math.abs(difference) < 50) return;

                const current = Number(
                    gallery.dataset.galleryIndex || 0
                );

                showSlide(
                    gallery,
                    current + (difference > 0 ? 1 : -1)
                );
            },
            { passive: true }
        );
    });


    /* =====================================================
       GALLERY ARROWS
    ===================================================== */

    document.addEventListener("click", (event) => {
        const button = event.target.closest(
            ".gallery-prev, .gallery-next"
        );

        if (!button) return;

        const gallery = button.closest(".gallery");

        if (!gallery) return;

        event.preventDefault();
        event.stopPropagation();

        const current = Number(
            gallery.dataset.galleryIndex || 0
        );

        const direction = button.classList.contains(
            "gallery-next"
        )
            ? 1
            : -1;

        showSlide(gallery, current + direction);
    });


    /* =====================================================
       PROJECT SELECTOR
    ===================================================== */

    const projectTabs = Array.from(
        document.querySelectorAll(".project-tab")
    );

    const projectPanels = Array.from(
        document.querySelectorAll(".project-panel")
    );

    function activateProject(projectKey) {
        if (!projectKey) return;

        projectTabs.forEach((tab) => {
            const active =
                tab.dataset.project === projectKey;

            tab.classList.toggle("active", active);

            tab.setAttribute(
                "aria-selected",
                String(active)
            );

            tab.setAttribute(
                "tabindex",
                active ? "0" : "-1"
            );
        });

        projectPanels.forEach((panel) => {
            const active =
                panel.dataset.projectPanel === projectKey;

            panel.classList.toggle("active", active);

            panel.setAttribute(
                "aria-hidden",
                String(!active)
            );
        });
    }


    /* =====================================================
       PROJECT TAB CLICKS + KEYBOARD NAVIGATION
    ===================================================== */

    projectTabs.forEach((tab) => {
        tab.addEventListener("click", (event) => {
            event.preventDefault();

            activateProject(tab.dataset.project);
        });

        tab.addEventListener("keydown", (event) => {
            const keys = [
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End"
            ];

            if (!keys.includes(event.key)) return;

            event.preventDefault();

            const current = projectTabs.indexOf(tab);
            let next = current;

            if (event.key === "ArrowLeft") {
                next =
                    (current - 1 + projectTabs.length) %
                    projectTabs.length;
            }

            if (event.key === "ArrowRight") {
                next = (current + 1) % projectTabs.length;
            }

            if (event.key === "Home") {
                next = 0;
            }

            if (event.key === "End") {
                next = projectTabs.length - 1;
            }

            projectTabs[next].focus();

            activateProject(
                projectTabs[next].dataset.project
            );
        });
    });

    if (projectTabs.length) {
        const initialTab =
            projectTabs.find((tab) =>
                tab.classList.contains("active")
            ) || projectTabs[0];

        activateProject(initialTab.dataset.project);
    }


    /* =====================================================
       SCROLL REVEAL ANIMATIONS
    ===================================================== */

    const revealItems = Array.from(
        document.querySelectorAll(".reveal")
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealItems.forEach((item) => {
            item.classList.add("visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealItems.forEach((item) => {
            revealObserver.observe(item);
        });
    }


    /* =====================================================
       ACTIVE NAVIGATION LINK
    ===================================================== */

    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    if (
        "IntersectionObserver" in window &&
        sections.length
    ) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    )[0];

                if (!visible) return;

                const sectionID = visible.target.id;

                navLinks.forEach((link) => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                            `#${sectionID}`
                    );
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: [0, 0.1, 0.25]
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const year = document.getElementById("current-year");

    if (year) {
        year.textContent = String(
            new Date().getFullYear()
        );
    }


    /* =====================================================
       VIDEO MODAL
    ===================================================== */

    const videoModal = document.getElementById(
        "videoModal"
    );

    const modalVideo = document.getElementById(
        "modalVideo"
    );

    function openVideo(src) {
        if (!videoModal || !modalVideo || !src) return;

        modalVideo.src = src;

        videoModal.classList.add("open");

        videoModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

        modalVideo.play().catch(() => {});
    }

    function closeVideo() {
        if (
            !videoModal ||
            !modalVideo ||
            !videoModal.classList.contains("open")
        ) {
            return;
        }

        videoModal.classList.remove("open");

        videoModal.setAttribute(
            "aria-hidden",
            "true"
        );

        modalVideo.pause();
        modalVideo.removeAttribute("src");
        modalVideo.load();

        document.body.style.overflow = "";
    }

    document.querySelectorAll(".video-play-button, .itgirls-demo-button, .cambridge-demo-button")
        .forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (button.dataset.video) {
                    openVideo(button.dataset.video);
                }
            });
        });

    videoModal
        ?.querySelector(".video-modal-close")
        ?.addEventListener("click", closeVideo);

    videoModal
        ?.querySelector(".video-modal-backdrop")
        ?.addEventListener("click", closeVideo);


    /* =====================================================
       LEADERSHIP & IMPACT — ALL 14 CARDS

       Reads details from <template class="leadership-detail">
       inside each card in index.html.

       Supports:
       - Detailed descriptions
       - Images
       - Watch Video links
       - Adaptive modal widths
       - Keyboard navigation
    ===================================================== */

    const leadershipModal = document.getElementById(
        "leadershipModal"
    );

    const leadershipTitle = document.getElementById(
        "leadershipModalTitle"
    );

    const leadershipBody = document.getElementById(
        "leadershipModalBody"
    );

    const leadershipDialog = leadershipModal?.querySelector(
        ".detail-modal-content"
    );

    let leadershipPreviousFocus = null;


    /* =====================================================
       OPEN LEADERSHIP MODAL
    ===================================================== */

    function openLeadership(card) {
        if (
            !leadershipModal ||
            !leadershipTitle ||
            !leadershipBody ||
            !card
        ) {
            return;
        }

        const template = card.querySelector(
            "template.leadership-detail"
        );

        if (!template) return;

        leadershipPreviousFocus = document.activeElement;

        const title = card
            .querySelector("h3")
            ?.textContent.trim();

        leadershipTitle.textContent =
            title || "Leadership";

        // Copy the detailed HTML for this specific card.
        leadershipBody.replaceChildren(
            template.content.cloneNode(true)
        );

        // Detect photographs and enlarge the modal.
        const photo = leadershipBody.querySelector(
            ".leadership-detail-image"
        );

        leadershipModal.classList.toggle(
            "has-media",
            Boolean(photo)
        );

        // Hide a photo if its image file is missing.
        if (photo) {
            photo.addEventListener(
                "error",
                () => {
                    photo.remove();

                    leadershipModal.classList.remove(
                        "has-media"
                    );
                },
                { once: true }
            );

            if (photo.complete && photo.naturalWidth === 0) {
                photo.remove();
                leadershipModal.classList.remove("has-media");
            }
        }

        leadershipModal.classList.add("open");

        leadershipModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";

        // Focus the close button when the popup opens.
        const closeButton = leadershipModal.querySelector(
            ".detail-modal-close"
        );

        if (closeButton) {
            closeButton.focus();
        } else {
            leadershipDialog?.focus();
        }
    }


    /* =====================================================
       CLOSE LEADERSHIP MODAL
    ===================================================== */

    function closeLeadership() {
        if (
            !leadershipModal ||
            !leadershipModal.classList.contains("open")
        ) {
            return;
        }

        leadershipModal.classList.remove(
            "open",
            "has-media"
        );

        leadershipModal.setAttribute(
            "aria-hidden",
            "true"
        );

        leadershipBody?.replaceChildren();

        document.body.style.overflow = "";

        // Return focus to the card that opened the modal.
        leadershipPreviousFocus?.focus?.();
    }


    /* =====================================================
       CLICKABLE LEADERSHIP CARDS
    ===================================================== */

    const leadershipGrid = document.querySelector(
        "#leadership .leadership-grid"
    );

    // Mouse clicks: works for all 14 cards.
    leadershipGrid?.addEventListener(
        "click",
        (event) => {
            const card = event.target.closest(
                ".leadership-card"
            );

            if (card) {
                openLeadership(card);
            }
        }
    );

    // Keyboard: Enter or Space opens a card.
    leadershipGrid?.addEventListener(
        "keydown",
        (event) => {
            const card = event.target.closest(
                ".leadership-card"
            );

            if (!card) return;

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }

            event.preventDefault();

            openLeadership(card);
        }
    );


    /* =====================================================
       LEADERSHIP MODAL CLOSE BUTTON + BACKDROP
    ===================================================== */

    leadershipModal
        ?.querySelector(".detail-modal-close")
        ?.addEventListener("click", closeLeadership);

    leadershipModal
        ?.querySelector(".detail-modal-backdrop")
        ?.addEventListener("click", closeLeadership);


    /* =====================================================
       ESCAPE KEY + MODAL KEYBOARD FOCUS
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        // Escape closes the currently open popup.
        if (event.key === "Escape") {

            if (
                leadershipModal?.classList.contains("open")
            ) {
                event.preventDefault();
                closeLeadership();
            } else if (
                videoModal?.classList.contains("open")
            ) {
                event.preventDefault();
                closeVideo();
            }

            return;
        }

        // Trap Tab navigation inside the Leadership modal.
        if (
            event.key !== "Tab" ||
            !leadershipModal?.classList.contains("open")
        ) {
            return;
        }

        const focusables = Array.from(
            leadershipModal.querySelectorAll(
                'button:not([disabled]), ' +
                'a[href], ' +
                '[tabindex]:not([tabindex="-1"])'
            )
        ).filter(
            (element) =>
                element.getClientRects().length > 0
        );

        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === first
        ) {
            event.preventDefault();
            last.focus();
        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    });

});
