const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            siteNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
    });
}, { threshold: 0.18 });

revealItems.forEach((item) => revealObserver.observe(item));

const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1400;
    const startTime = performance.now();

    const updateValue = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased).toLocaleString("en-IN");

        if (progress < 1) {
            requestAnimationFrame(updateValue);
            return;
        }

        counter.textContent = target.toLocaleString("en-IN");
    };

    requestAnimationFrame(updateValue);
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) {
            return;
        }

        animateCounter(entry.target);
        observer.unobserve(entry.target);
    });
}, { threshold: 0.7 });

counters.forEach((counter) => counterObserver.observe(counter));
