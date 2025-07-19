// projects.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Project Expander Logic ---
    const detailButtons = document.querySelectorAll('.btn-outline-light[href^="#project-"]');

    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const content = document.querySelector(targetId);

            if (content) {
                // Toggle the 'show' class to trigger the animation
                content.classList.toggle('show');

                // Change button text based on state
                if (content.classList.contains('show')) {
                    this.textContent = 'Hide AI Modules';
                    // Smooth scroll to the content
                    setTimeout(() => {
                        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300); // Delay to allow expander to start opening
                } else {
                    this.textContent = 'Explore AI Modules';
                }
            }
        });
    });

    // --- Scroll Animation for Project Items ---
    const projectItems = document.querySelectorAll('.project-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    projectItems.forEach(item => {
        // Initially pause the animation
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });

});
