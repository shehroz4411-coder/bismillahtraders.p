/* =========================================================
   BISMILLAH TRADERS & MANUFACTURING
   WEBSITE JAVASCRIPT
   Developed by Shehroz Khan
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        if (navMenu.classList.contains("active")) {
            menuToggle.innerHTML = "✕";
        } else {
            menuToggle.innerHTML = "☰";
        }

    });


    /* Close menu when link is clicked */

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuToggle.innerHTML = "☰";

        });

    });

}


/* =========================================================
   BACK TO TOP
========================================================= */

const backTop = document.getElementById("backTop");

if (backTop) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            backTop.classList.add("show");

        } else {

            backTop.classList.remove("show");

        }

    });


    backTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   CURRENT YEAR
========================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            this.querySelector('[name="name"]')?.value.trim();

        const phone =
            this.querySelector('[name="phone"]')?.value.trim();

        const subject =
            this.querySelector('[name="subject"]')?.value.trim();

        const message =
            this.querySelector('[name="message"]')?.value.trim();


        if (!name || !phone || !message) {

            alert(
                "Please fill in your name, phone number and message."
            );

            return;

        }


        /*
            Temporary WhatsApp inquiry system.

            Later we can connect this form
            directly with your Node.js backend
            and MongoDB.
        */

        const whatsappNumber =
            "923465708139";


        const whatsappMessage =
            `Hello Ashir,%0A%0A` +

            `Name: ${encodeURIComponent(name)}%0A` +

            `Phone: ${encodeURIComponent(phone)}%0A` +

            `Subject: ${encodeURIComponent(subject || "General Inquiry")}%0A%0A` +

            `Message:%0A${encodeURIComponent(message)}`;


        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


        window.open(
            whatsappURL,
            "_blank"
        );


        this.reset();

    });

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section, .project, .contact-item, .developer-profile"
    );


if (revealElements.length > 0) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "reveal-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

}


/* =========================================================
   IMAGE PLACEHOLDER CLICK
========================================================= */

const imagePlaceholders =
    document.querySelectorAll(
        ".project-placeholder, .profile-placeholder, .developer-photo-placeholder"
    );


imagePlaceholders.forEach(placeholder => {

    placeholder.addEventListener("click", () => {

        console.log(
            "Photo space ready — replace this placeholder with the real project image."
        );

    });

});


/* =========================================================
   SMOOTH ANCHOR SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (event) {

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});


/* =========================================================
   CONSOLE BRAND CREDIT
========================================================= */

console.log(
    "%c BISMILLAH TRADERS & MANUFACTURING ",
    "background:#c9a45c;color:#080808;font-size:16px;font-weight:bold;padding:8px;"
);

console.log(
    "%c Website Designed & Developed by Shehroz Khan ",
    "color:#c9a45c;font-size:14px;font-weight:bold;"
);
/* =========================================================
   PRODUCT FILTER
========================================================= */

const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");

if (filterButtons.length && productCards.length) {

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            // Active button change
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            // Selected category
            const selectedCategory = button.dataset.filter;

            // Filter products
            productCards.forEach(card => {

                const productCategory = card.dataset.category;

                if (
                    selectedCategory === "all" ||
                    productCategory === selectedCategory
                ) {

                    card.style.display = "block";

                    // Small animation
                    card.classList.remove("filter-show");

                    void card.offsetWidth;

                    card.classList.add("filter-show");

                } else {

                    card.style.display = "none";

                }

            });

        });

    });

}