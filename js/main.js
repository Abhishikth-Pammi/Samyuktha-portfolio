/* =========================================================
   SAI SAMYUKTHA PAMMI PORTFOLIO — INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GLOBAL ELEMENTS
    ===================================================== */

    const header = document.getElementById("site-header");
    const menuButton = document.getElementById("mobile-menu-button");
    const navLinksContainer = document.getElementById("nav-links");
    const navLinks = Array.from(
        document.querySelectorAll(".nav-link")
    );


    /* =====================================================
       HEADER SCROLL EFFECT
    ===================================================== */

    function updateHeader() {
        if (!header) return;

        header.classList.toggle(
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

        const open =
            navLinksContainer?.classList.toggle("open") ??
            false;

        menuButton.classList.toggle("open", open);

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );

        document.body.classList.toggle(
            "menu-open",
            open
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

            document.body.classList.remove(
                "menu-open"
            );
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
            gallery.querySelectorAll(
                ".gallery-slide"
            )
        );

        if (!slides.length) return;


        const index =
            (
                (
                    requestedIndex %
                    slides.length
                ) +
                slides.length
            ) %
            slides.length;


        gallery.dataset.galleryIndex =
            String(index);


        slides.forEach(
            (slide, slideIndex) => {

                const active =
                    slideIndex === index;

                slide.classList.toggle(
                    "active",
                    active
                );

                slide.setAttribute(
                    "aria-hidden",
                    String(!active)
                );
            }
        );


        const counter =
            gallery.querySelector(
                ".gallery-counter"
            );


        if (counter) {

            counter.textContent =
                `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

        }
    }


    /* =====================================================
       INITIALISE GALLERIES
    ===================================================== */

    galleries.forEach((gallery) => {

        const slides = Array.from(
            gallery.querySelectorAll(
                ".gallery-slide"
            )
        );


        let initial =
            slides.findIndex(
                (slide) =>
                    slide.classList.contains(
                        "active"
                    )
            );


        if (initial < 0) {
            initial = 0;
        }


        showSlide(
            gallery,
            initial
        );


        /* Mobile swipe support */

        let startX = 0;


        gallery.addEventListener(
            "touchstart",
            (event) => {

                startX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive: true
            }
        );


        gallery.addEventListener(
            "touchend",
            (event) => {

                const endX =
                    event.changedTouches[0]
                        .screenX;


                const difference =
                    startX - endX;


                if (
                    Math.abs(difference) <
                    50
                ) {
                    return;
                }


                const current =
                    Number(
                        gallery.dataset
                            .galleryIndex || 0
                    );


                showSlide(
                    gallery,
                    current +
                    (
                        difference > 0
                            ? 1
                            : -1
                    )
                );

            },
            {
                passive: true
            }
        );

    });


    /* =====================================================
       GALLERY ARROWS
    ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".gallery-prev, .gallery-next"
                );


            if (!button) return;


            const gallery =
                button.closest(".gallery");


            if (!gallery) return;


            event.preventDefault();
            event.stopPropagation();


            const current =
                Number(
                    gallery.dataset
                        .galleryIndex || 0
                );


            const direction =
                button.classList.contains(
                    "gallery-next"
                )
                    ? 1
                    : -1;


            showSlide(
                gallery,
                current + direction
            );

        }
    );


    /* =====================================================
       PROJECT SELECTOR
    ===================================================== */

    const projectTabs = Array.from(
        document.querySelectorAll(
            ".project-tab"
        )
    );


    const projectPanels = Array.from(
        document.querySelectorAll(
            ".project-panel"
        )
    );


    function activateProject(projectKey) {

        if (!projectKey) return;


        projectTabs.forEach((tab) => {

            const active =
                tab.dataset.project ===
                projectKey;


            tab.classList.toggle(
                "active",
                active
            );


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
                panel.dataset
                    .projectPanel ===
                projectKey;


            panel.classList.toggle(
                "active",
                active
            );


            panel.setAttribute(
                "aria-hidden",
                String(!active)
            );

        });
    }


    /* =====================================================
       PROJECT TAB CLICKS
    ===================================================== */

    projectTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                activateProject(
                    tab.dataset.project
                );

            }
        );


        /* Keyboard navigation */

        tab.addEventListener(
            "keydown",
            (event) => {

                const validKeys = [
                    "ArrowLeft",
                    "ArrowRight",
                    "Home",
                    "End"
                ];


                if (
                    !validKeys.includes(
                        event.key
                    )
                ) {
                    return;
                }


                event.preventDefault();


                const current =
                    projectTabs.indexOf(
                        tab
                    );


                let next = current;


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    next =
                        (
                            current -
                            1 +
                            projectTabs.length
                        ) %
                        projectTabs.length;

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    next =
                        (
                            current +
                            1
                        ) %
                        projectTabs.length;

                }


                if (
                    event.key ===
                    "Home"
                ) {

                    next = 0;

                }


                if (
                    event.key ===
                    "End"
                ) {

                    next =
                        projectTabs.length -
                        1;

                }


                const nextTab =
                    projectTabs[next];


                nextTab.focus();


                activateProject(
                    nextTab.dataset.project
                );

            }
        );

    });


    /* Initial active project */

    if (projectTabs.length) {

        const initialTab =
            projectTabs.find(
                (tab) =>
                    tab.classList.contains(
                        "active"
                    )
            ) ||
            projectTabs[0];


        activateProject(
            initialTab.dataset.project
        );
    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealItems = Array.from(
        document.querySelectorAll(
            ".reveal"
        )
    );


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        reducedMotion ||
        !(
            "IntersectionObserver" in
            window
        )
    ) {

        revealItems.forEach((item) => {

            item.classList.add(
                "visible"
            );

        });

    } else {

        const revealObserver =
            new IntersectionObserver(
                (
                    entries,
                    observer
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target
                                .classList.add(
                                    "visible"
                                );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        revealItems.forEach((item) => {

            revealObserver.observe(
                item
            );

        });

    }


    /* =====================================================
       ACTIVE NAVIGATION LINK
    ===================================================== */

    const sections = Array.from(
        document.querySelectorAll(
            "main section[id]"
        )
    );


    if (
        "IntersectionObserver" in window &&
        sections.length
    ) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    const visible =
                        entries
                            .filter(
                                (entry) =>
                                    entry
                                        .isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    b
                                        .intersectionRatio -
                                    a
                                        .intersectionRatio
                            )[0];


                    if (!visible) return;


                    const sectionID =
                        visible.target.id;


                    navLinks.forEach((link) => {

                        link.classList.toggle(
                            "active",

                            link.getAttribute(
                                "href"
                            ) ===
                                `#${sectionID}`
                        );

                    });

                },
                {
                    rootMargin:
                        "-25% 0px -60% 0px",

                    threshold: [
                        0,
                        0.1,
                        0.25
                    ]
                }
            );


        sections.forEach((section) => {

            sectionObserver.observe(
                section
            );

        });

    }


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const year =
        document.getElementById(
            "current-year"
        );


    if (year) {

        year.textContent =
            new Date()
                .getFullYear();

    }


    /* =====================================================
       VIDEO MODAL
    ===================================================== */

    const videoModal =
        document.getElementById(
            "videoModal"
        );


    const modalVideo =
        document.getElementById(
            "modalVideo"
        );


    function openVideo(src) {

        if (
            !videoModal ||
            !modalVideo ||
            !src
        ) {
            return;
        }


        modalVideo.src = src;


        videoModal.classList.add(
            "open"
        );


        videoModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        modalVideo
            .play()
            .catch(() => {});

    }


    function closeVideo() {

        if (
            !videoModal ||
            !modalVideo
        ) {
            return;
        }


        videoModal.classList.remove(
            "open"
        );


        videoModal.setAttribute(
            "aria-hidden",
            "true"
        );


        modalVideo.pause();


        modalVideo.removeAttribute(
            "src"
        );


        modalVideo.load();


        document.body.style.overflow =
            "";

    }


    document
        .querySelectorAll(
            ".video-play-button"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    const src =
                        button.dataset.video;


                    if (src) {

                        openVideo(src);

                    }

                }
            );

        });


    document
        .querySelector(
            ".video-modal-close"
        )
        ?.addEventListener(
            "click",
            closeVideo
        );


    document
        .querySelector(
            ".video-modal-backdrop"
        )
        ?.addEventListener(
            "click",
            closeVideo
        );


    /* =====================================================
       LEADERSHIP MODAL
    ===================================================== */

    const leadershipModal =
        document.getElementById(
            "leadershipModal"
        );


    const leadershipTitle =
        document.getElementById(
            "leadershipModalTitle"
        );


    const leadershipBody =
        document.getElementById(
            "leadershipModalBody"
        );


    const leadershipLink =
        document.getElementById(
            "leadershipModalLink"
        );


    const leadershipDetails = {

        "Festival of Lights":
            "Initiated and led a large-scale school event from conception through programme development, communication and logistics, coordinating people and moving parts to create an inclusive school experience.",


        "Voices in Motion":
            "Co-created a weekly rapid-debate platform focused on evidence-based argument, intellectual confidence and student voice, helping students practise thinking and speaking under time pressure.",


        "AI & Education":
            "Represented Repton Dubai in discussions and speaking opportunities focused on responsible, meaningful integration of AI into education.",


        "Public Relations Ambassador":
            "Supported outreach, communication and participation as part of the Student Leadership Team, helping strengthen student voice and wider school engagement."

    };


    function openLeadership(card) {

        if (!leadershipModal) {
            return;
        }


        const title =
            card
                .querySelector("h3")
                ?.textContent
                .trim();


        if (!title) return;


        if (leadershipTitle) {

            leadershipTitle.textContent =
                title;

        }


        const fallback =
            card
                .querySelector(
                    "p:last-of-type"
                )
                ?.textContent ||
            "";


        if (leadershipBody) {

            const paragraph =
                document.createElement(
                    "p"
                );


            paragraph.textContent =
                leadershipDetails[
                    title
                ] ||
                fallback;


            leadershipBody.replaceChildren(
                paragraph
            );

        }


        if (leadershipLink) {

            const isAI =
                title ===
                "AI & Education";


            leadershipLink.hidden =
                !isAI;


            if (isAI) {

                /*
                 * IMPORTANT:
                 * This is a normal external URL.
                 * Do NOT add backslashes to https:// or www.
                 */
                leadershipLink.href =
                    "https://www.youtube.com/watch?feature=shared&v=GEHEZNo3INg";


                leadershipLink.target =
                    "_blank";


                leadershipLink.rel =
                    "noopener noreferrer";

            }

        }


        leadershipModal.classList.add(
            "open"
        );


        leadershipModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeLeadership() {

        if (!leadershipModal) {
            return;
        }


        leadershipModal.classList.remove(
            "open"
        );


        leadershipModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       CLICKABLE LEADERSHIP CARDS
    ===================================================== */

    document
        .querySelectorAll(
            ".leadership-card[role='button']"
        )
        .forEach((card) => {

            card.addEventListener(
                "click",
                () => {

                    openLeadership(
                        card
                    );

                }
            );


            card.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key !==
                            "Enter" &&
                        event.key !==
                            " "
                    ) {
                        return;
                    }


                    event.preventDefault();


                    openLeadership(
                        card
                    );

                }
            );

        });


    document
        .querySelector(
            ".detail-modal-close"
        )
        ?.addEventListener(
            "click",
            closeLeadership
        );


    document
        .querySelector(
            ".detail-modal-backdrop"
        )
        ?.addEventListener(
            "click",
            closeLeadership
        );


    /* =====================================================
       ESCAPE KEY — CLOSE MODALS
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }


            closeVideo();
            closeLeadership();

        }
    );

});