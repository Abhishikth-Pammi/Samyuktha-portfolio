/* =========================================================

   GLOBAL ELEMENTS

========================================================= */



const header = document.getElementById("site-header");

const menuButton = document.getElementById("mobile-menu-button");

const navLinksContainer = document.getElementById("nav-links");

const navLinks = document.querySelectorAll(".nav-link");





/* =========================================================

   HEADER SCROLL EFFECT

========================================================= */



function updateHeader() {

    if (header) {

        header.classList.toggle("scrolled", window.scrollY > 30);

    }

}



window.addEventListener("scroll", updateHeader);

updateHeader();





/* =========================================================

   MOBILE NAVIGATION

========================================================= */



menuButton?.addEventListener("click", () => {

    const open = navLinksContainer?.classList.toggle("open");



    menuButton.classList.toggle("open", Boolean(open));

    menuButton.setAttribute("aria-expanded", String(Boolean(open)));



    document.body.classList.toggle(

        "menu-open",

        Boolean(open)

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





/* =========================================================
   GALLERIES / IMAGE CAROUSELS
========================================================= */

const galleryState = new WeakMap();

function setupGallery(gallery) {
    const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
    if (!slides.length) return;

    let index = slides.findIndex((slide) => slide.classList.contains("active"));
    if (index < 0) index = 0;

    galleryState.set(gallery, { slides, index });
    showGallerySlide(gallery, index);

    let startX = 0;
    gallery.addEventListener("touchstart", (event) => {
        startX = event.changedTouches[0].screenX;
    }, { passive: true });

    gallery.addEventListener("touchend", (event) => {
        const difference = startX - event.changedTouches[0].screenX;
        if (Math.abs(difference) < 50) return;
        moveGallery(gallery, difference > 0 ? 1 : -1);
    }, { passive: true });
}

function showGallerySlide(gallery, requestedIndex) {
    const state = galleryState.get(gallery);
    if (!state || !state.slides.length) return;

    const total = state.slides.length;
    state.index = (requestedIndex + total) % total;

    state.slides.forEach((slide, slideIndex) => {
        const active = slideIndex === state.index;
        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", String(!active));
    });

    const counter = gallery.querySelector(".gallery-counter");
    if (counter) {
        counter.textContent =
            `${String(state.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    }
}

function moveGallery(gallery, amount) {
    const state = galleryState.get(gallery);
    if (!state) return;
    showGallerySlide(gallery, state.index + amount);
}

document.querySelectorAll(".gallery").forEach(setupGallery);

/* One delegated click handler prevents duplicate/failed arrow bindings. */
document.addEventListener("click", (event) => {
    const next = event.target.closest(".gallery-next");
    const prev = event.target.closest(".gallery-prev");

    if (next || prev) {
        const button = next || prev;
        const gallery = button.closest(".gallery");
        if (!gallery) return;

        event.preventDefault();
        event.stopPropagation();
        moveGallery(gallery, next ? 1 : -1);
    }
});


/* =========================================================
   PROJECT SELECTOR
========================================================= */

const projectTabs = document.querySelectorAll(".project-tab");
const projectPanels = document.querySelectorAll(".project-panel");

function activateProject(projectKey) {
    projectTabs.forEach((tab) => {
        const active = tab.dataset.project === projectKey;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });

    projectPanels.forEach((panel) => {
        const active = panel.dataset.projectPanel === projectKey;
        panel.classList.toggle("active", active);
        panel.setAttribute("aria-hidden", String(!active));
    });
}

document.addEventListener("click", (event) => {
    const tab = event.target.closest(".project-tab");
    if (!tab) return;

    const projectKey = tab.dataset.project;
    if (!projectKey) return;

    event.preventDefault();
    activateProject(projectKey);
});

if (projectTabs.length) {
    const initial = document.querySelector(".project-tab.active") || projectTabs[0];
    if (initial?.dataset.project) activateProject(initial.dataset.project);
}


/* =========================================================

   SCROLL REVEAL ANIMATION

========================================================= */



const reducedMotion =

    window.matchMedia(

        "(prefers-reduced-motion: reduce)"

    ).matches;



const revealItems =

    document.querySelectorAll(".reveal");





if (reducedMotion) {



    revealItems.forEach((item) => {

        item.classList.add("visible");

    });



} else {



    const revealObserver =

        new IntersectionObserver(



            (entries, observer) => {



                entries.forEach((entry) => {



                    if (

                        entry.isIntersecting

                    ) {



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

                rootMargin:

                    "0px 0px -40px 0px"

            }

        );





    revealItems.forEach((item) => {

        revealObserver.observe(item);

    });

}





/* =========================================================

   ACTIVE NAVIGATION LINK

========================================================= */



const sections =

    document.querySelectorAll(

        "main section[id]"

    );





if (sections.length > 0) {



    const activeObserver =

        new IntersectionObserver(



            (entries) => {



                entries.forEach((entry) => {



                    if (

                        entry.isIntersecting

                    ) {



                        const id =

                            entry.target.id;



                        navLinks.forEach(

                            (link) => {



                                link.classList.toggle(



                                    "active",



                                    link.getAttribute(

                                        "href"

                                    ) === `#${id}`

                                );

                            }

                        );

                    }



                });

            },



            {

                rootMargin:

                    "-35% 0px -55% 0px",



                threshold: 0

            }

        );





    sections.forEach((section) => {

        activeObserver.observe(section);

    });

}





/* =========================================================

   CURRENT YEAR

========================================================= */



const year =

    document.getElementById(

        "current-year"

    );



if (year) {



    year.textContent =

        new Date().getFullYear();

}





/* =========================================================

   VIDEO MODAL

========================================================= */



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





/* =========================================================

   LEADERSHIP DETAIL MODAL

========================================================= */



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



    const title =

        card

            .querySelector("h3")

            ?.textContent

            .trim();





    if (

        !title ||

        !leadershipModal

    ) {

        return;

    }





    if (leadershipTitle) {



        leadershipTitle.textContent =

            title;

    }





    if (leadershipBody) {



        const description =

            leadershipDetails[title] ||



            card

                .querySelector(

                    "p:last-of-type"

                )

                ?.textContent ||



            "";





        leadershipBody.innerHTML =

            `<p>${description}</p>`;

    }





    const isAI =

        title === "AI & Education";





    if (leadershipLink) {



        leadershipLink.hidden =

            !isAI;



        if (isAI) {



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



    leadershipModal?.classList.remove(

        "open"

    );



    leadershipModal?.setAttribute(

        "aria-hidden",

        "true"

    );



    document.body.style.overflow =

        "";

}





/* =========================================================

   CLICKABLE LEADERSHIP CARDS

========================================================= */



document

    .querySelectorAll(

        ".leadership-card[role='button']"

    )

    .forEach((card) => {



        card.addEventListener(

            "click",

            () => {

                openLeadership(card);

            }

        );





        card.addEventListener(

            "keydown",

            (event) => {



                if (

                    event.key === "Enter" ||

                    event.key === " "

                ) {



                    event.preventDefault();



                    openLeadership(card);

                }

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





/* =========================================================

   ESCAPE KEY

========================================================= */



document.addEventListener(

    "keydown",

    (event) => {



        if (

            event.key === "Escape"

        ) {



            closeVideo();

            closeLeadership();

        }

    }

);