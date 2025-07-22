document.addEventListener('DOMContentLoaded', function () {
    const expanderButton = document.querySelector('a[href="#project-1-details"]');
    const content = document.getElementById('project-1-details');

    if (expanderButton) {
        expanderButton.addEventListener('click', function (e) {
            e.preventDefault();
            content.classList.toggle('show');
            const isExpanded = content.classList.contains('show');
            expanderButton.textContent = isExpanded ? 'Hide AI Modules' : 'Explore AI Modules';
        });
    }

    // Add scroll-triggered animation for academic items
    const academicItems = document.querySelectorAll('.academic-item');
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

    academicItems.forEach(item => {
        observer.observe(item);
    });
});