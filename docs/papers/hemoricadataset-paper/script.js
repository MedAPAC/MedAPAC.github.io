// script.js for the HemoricaDataset paper page

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Intersection Observer to add 'is-visible' class to elements when they enter the viewport.
     * This triggers the fade-in animation defined in the CSS.
     */
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

    // Select all elements with the 'fade-in-item' class to be observed
    const animatedElements = document.querySelectorAll('.fade-in-item');

    // Attach the observer to each of the selected elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    console.log("HemoricaDataset page loaded and animations are active.");
});
