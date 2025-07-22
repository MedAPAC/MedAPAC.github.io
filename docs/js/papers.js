// Combined script for all paper pages

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Intersection Observer to add 'is-visible' class to elements when they enter the viewport.
     * This triggers the fade-in animation defined in the CSS.
     * It will only run if elements with the 'fade-in-item' class exist on the page.
     */
    const animatedElements = document.querySelectorAll('.fade-in-item');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the element is intersecting the viewport, add the 'is-visible' class
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing the element once it's visible to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        // Attach the observer to each of the selected elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });

        console.log("Page loaded and fade-in animations are active.");
    } else {
        console.log("Page loaded. No fade-in elements found.");
    }

    // You can add any other page-specific or global JavaScript functionality here.
    console.log("Paper detail page loaded.");
});