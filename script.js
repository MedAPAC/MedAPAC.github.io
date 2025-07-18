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
            { name: "Emily Carter", position: "Lead Front-End Developer", image: "Members/person3.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Jon Arshaf", position: "Digital Marketer", image: "Members/person1.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Kani Jon", position: "UI/UX Designer", image: "Members/person2.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Maria Rodriguez", position: "Back-End Developer", image: "Members/person3.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Alex Chen", position: "Project Manager", image: "Members/person1.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "David Smith", position: "DevOps Engineer", image: "Members/person2.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Sophia Loren", position: "QA Tester", image: "Members/person3.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Michael B.", position: "Data Scientist", image: "Members/person1.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Chris Evans", position: "Mobile Developer", image: "Members/person2.png", linkedin: "#", github: "#", personalPage: "#" },
            { name: "Jessica Alba", position: "Content Strategist", image: "Members/person3.png", linkedin: "#", github: "#", personalPage: "#" }
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

// Function to open the chat window
function openChat() {
  document.getElementById("aiChat").style.display = "block";
}

// Function to close the chat window
function closeChat() {
  document.getElementById("aiChat").style.display = "none";
}

// Function to send a message
async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const message = userInput.value;
  if (message.trim() === "") return;

  const chatMessages = document.getElementById("chatMessages");

  // Display user's message
  const userMessageElement = document.createElement("div");
  userMessageElement.classList.add("message", "sent");
  userMessageElement.textContent = message;
  chatMessages.appendChild(userMessageElement);

  // Clear the input field
  userInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom

  try {
    // --- Send message to your API ---
    const response = await fetch('/ask-ai', { // <-- IMPORTANT: Replace with your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    });

    if (!response.ok) {
        throw new Error("API response was not ok.");
    }
    
    const data = await response.json();
    const aiResponse = data.reply; // Assuming your API returns a JSON with a 'reply' field

    // Display AI's response
    const aiMessageElement = document.createElement("div");
    aiMessageElement.classList.add("message", "received");
    aiMessageElement.textContent = aiResponse;
    chatMessages.appendChild(aiMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom

  } catch (error) {
    console.error("Error fetching AI response:", error);
    const errorMessageElement = document.createElement("div");
    errorMessageElement.classList.add("message", "received");
    errorMessageElement.textContent = "Sorry, something went wrong. Please try again.";
    chatMessages.appendChild(errorMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
  }
}

// Allow sending message by pressing "Enter"
document.getElementById("userInput").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});