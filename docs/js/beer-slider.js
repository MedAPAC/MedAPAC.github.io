document.addEventListener("DOMContentLoaded", function() {

    // --- Logic for "Explore AI Modules" expander ---
    const expanderButton = document.querySelector('[href="#project-1-details"]');
    if (expanderButton) {
        expanderButton.addEventListener('click', function(e) {
            e.preventDefault();
            const content = document.getElementById('project-1-details');
            if (content) {
                content.classList.toggle('show');
            }
        });
    }

    // --- Intersection Observer for card animations ---
    const animatedItems = document.querySelectorAll('.academic-item');
    if (animatedItems.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedItems.forEach(item => {
            observer.observe(item);
        });
    }


    // --- BEER SLIDER SCRIPT ---
    class BeerSlider {
        constructor(element, { start = "50" } = {}) {
            this.start = parseInt(start, 10) ? Math.min(100, Math.max(0, parseInt(start, 10))) : 50;
            this.element = element;
            if (!this.element) return;

            // Use querySelector for more robust element finding
            this.revealContainer = this.element.querySelector(".beer-reveal");
            if (!this.revealContainer) return;
            
            this.revealElement = this.revealContainer.children[0];
            this.range = this.addElement("input", {
                type: "range",
                class: "beer-range",
                "aria-label": "Percent of revealed content",
                "aria-valuemin": "0",
                "aria-valuemax": "100",
                "aria-valuenow": this.start,
                value: this.start,
                min: "0",
                max: "100"
            });
            this.handle = this.addElement("span", {
                class: "beer-handle"
            });
            this.onImagesLoad();
        }

        init() {
            this.element.classList.add("beer-ready");
            this.move();
            this.addListeners();
        }

        loadingImg(src) {
            return new Promise((resolve, reject) => {
                if (!src) {
                    resolve();
                    return;
                }
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
                img.src = src;
            });
        }

        loadedBoth() {
            const mainImage = this.element.children[1]; // Base image
            const mainImageSrc = mainImage.src || mainImage.getAttribute('data-beer-src');
            const revealImageSrc = this.revealElement.src || this.revealElement.getAttribute('data-beer-src');

            return Promise.all([
                this.loadingImg(mainImageSrc),
                this.loadingImg(revealImageSrc)
            ]);
        }
        
        onImagesLoad() {
            if (!this.revealElement) return;
            this.loadedBoth().then(
                () => { this.init(); },
                (error) => { console.error("BeerSlider Error:", error); }
            );
        }

        addElement(tag, attributes) {
            const el = document.createElement(tag);
            Object.keys(attributes).forEach((key) => {
                el.setAttribute(key, attributes[key]);
            });
            this.element.appendChild(el);
            return el;
        }

        addListeners() {
            const eventTypes = ["input", "change", "touchmove"];
            eventTypes.forEach((i) => {
                this.range.addEventListener(i, () => {
                    this.move();
                });
            });
        }

        move() {
            this.revealContainer.style.setProperty("--width", `${this.range.value}%`);
            this.handle.style.left = `${this.range.value}%`;
            this.range.setAttribute("aria-valuenow", this.range.value);
        }
    }

    // Initialize the slider
    const sliderElement = document.getElementById("slider");
    if (sliderElement) {
        new BeerSlider(sliderElement, { start: 50 });
    }
});