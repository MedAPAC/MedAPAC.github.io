// --- Hero Section Dynamic Text ---
const words = ["beautiful", "scalable", "mobile", "fast", "modern", "web"];
let index = 0;
const dynamicTextElement = document.getElementById('hero-dynamic-text');

// Function to change the word
function changeWord() {
    if (!dynamicTextElement) return;
    // Fade out
    dynamicTextElement.style.opacity = 0;

    setTimeout(() => {
        // Change word
        index = (index + 1) % words.length;
        dynamicTextElement.textContent = words[index];

        // Fade in
        dynamicTextElement.style.opacity = 1;
    }, 500); // Half a second for fade-out transition
}

// Set the interval to 3 seconds
setInterval(changeWord, 3000);

// Add a smooth transition effect via CSS
if(dynamicTextElement) {
    dynamicTextElement.style.transition = "opacity 0.5s ease-in-out";
}

// Add this event listener to ensure the HTML is loaded before the script runs.
document.addEventListener('DOMContentLoaded', function() {

    // --- Team Section Carousel ---
    const teamCarousel = document.querySelector('.team-carousel');
    
    // Check if the team carousel element exists on the page
    if (teamCarousel) {
        // --- 1. Team Member Data ---
        const teamMembers = [
            { name: "Emily Carter", position: "Lead Front-End Developer", image: "section5/person3.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Jon Arshaf", position: "Digital Marketer", image: "section5/person1.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Kani Jon", position: "UI/UX Designer", image: "section5/person2.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Maria Rodriguez", position: "Back-End Developer", image: "section5/person3.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Alex Chen", position: "Project Manager", image: "section5/person1.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "David Smith", position: "DevOps Engineer", image: "section5/person2.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Sophia Loren", position: "QA Tester", image: "section5/person3.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Michael B.", position: "Data Scientist", image: "section5/person1.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Chris Evans", position: "Mobile Developer", image: "section5/person2.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Jessica Alba", position: "Content Strategist", image: "section5/person3.png", linkedin: "#", github: "#", personalPage: "#" }
        ];

        // --- 2. Create and Inject HTML for each card ---
        let cardsHTML = '';
        teamMembers.forEach(member => {
            cardsHTML += `
                <div class="team-card">
                    <img src="${member.image}" alt="${member.name}" class="team-card-img">
                    <div class="team-card-info">
                        <h5>${member.name}</h5>
                        <p>${member.position}</p>
                        <div class="team-social-links">
                            <a href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                            <a href="${member.github}" target="_blank"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                    <a href="${member.personalPage}" class="personal-page-link" target="_blank">
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
        });
        teamCarousel.innerHTML = cardsHTML;

        // --- 3. Carousel Logic ---
        const cards = document.querySelectorAll('.team-card');
        const prevBtn = document.getElementById('team-prev');
        const nextBtn = document.getElementById('team-next');
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, i) => {
                // Reset all classes on the card before reapplying
                card.className = 'team-card'; 

                let relativeIndex = i - currentIndex;
                
                // This logic handles the seamless looping of the carousel
                if (relativeIndex < -Math.floor(cards.length / 2)) {
                    relativeIndex += cards.length;
                }
                if (relativeIndex > Math.floor(cards.length / 2)) {
                    relativeIndex -= cards.length;
                }

                // Apply new state classes based on the card's relative position
                switch (relativeIndex) {
                    case 0:
                        card.classList.add('active');
                        break;
                    case -1:
                        card.classList.add('prev');
                        break;
                    case 1:
                        card.classList.add('next');
                        break;
                    case -2:
                        card.classList.add('prev-2');
                        break;
                    case 2:
                        card.classList.add('next-2');
                        break;
                    default:
                        // Cards further away are hidden to the correct side
                        if (relativeIndex < -2) {
                            card.classList.add('hidden-prev');
                        } else {
                            card.classList.add('hidden-next');
                        }
                        break;
                }
            });
        }

        // --- 4. Event Listeners ---
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });

        // Initialize the carousel on load
        updateCarousel();
    }
});
