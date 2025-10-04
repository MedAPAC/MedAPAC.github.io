// File: /js/script.js

document.addEventListener('DOMContentLoaded', function () {
  let chatUserId = null;
  let isChatInitialized = false;

  // --- Hero Section Dynamic Text ---
  const words = ["Workflow Intelligence", "Predictive Care", "Next-Gen Co-Pilots "];
  let index = 0;
  const dynamicTextElement = document.getElementById('hero-dynamic-text');

  function changeWord() {
    if (!dynamicTextElement) return;
    dynamicTextElement.style.opacity = 0;
    setTimeout(() => {
      index = (index + 1) % words.length;
      dynamicTextElement.textContent = words[index];
      dynamicTextElement.style.opacity = 1;
    }, 500);
  }

  if (dynamicTextElement) {
    dynamicTextElement.style.transition = "opacity 0.5s ease-in-out";
    setInterval(changeWord, 3000);
  }

  const teamCarousel = document.querySelector('.team-carousel');
  if (teamCarousel) {

    const teamMembers = [
        { 
            name: "Mohammad Hoseyni", 
            position: "Team Member", 
            image: "Members/Mohammad Hoseyni/Mohammad Hoseyni.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Mohammad Hoseyni/index.html" 
        },
          { 
            name: "Arman Forouzesh", 
            position: "Team Member", 
            image: "Members/Kasra Davoodi/Kasra Davoodi.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Arman Forouzesh/index.html" 
        },
        { 
            name: "Hosein Asadolahi", 
            position: "Team Member", 
            image: "Members/Kasra Davoodi/Kasra Davoodi.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Asad/index.html" 
        },
        { 
            name: "Kasra Davoodi", 
            position: "Team Member", 
            image: "Members/Kasra Davoodi/Kasra Davoodi.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Kasra Davoodi/index.html" 
        },
                        { 
            name: "Tanaz Ghahremani", 
            position: "Team Member", 
            image: "Members/Tanaz Ghahremani/TG.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Tanaz Ghahremani/index.html" 
        },

                { 
            name: "Amirreza Parvahan", 
            position: "Team Member", 
            image: "Members/Amirreza Parvahan/AP1.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Amirreza Parvahan/index.html" 
        },
        
        { 
            name: "Zahra Rafati", 
            position: "Team Member", 
            image: "Members/Tarane Rafati/TR1.png", 
            linkedin: "#", 
            github: "#", 
            personalPage: "Members/Tarane Rafati/index.html" 
        }
    ];


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
    
    const cards = document.querySelectorAll('.team-card');
    const prevBtn = document.getElementById('team-prev');
    const nextBtn = document.getElementById('team-next');
    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, i) => {
            card.className = 'team-card';
            let relativeIndex = i - currentIndex;
            if (relativeIndex < -Math.floor(cards.length / 2)) {
                relativeIndex += cards.length;
            }
            if (relativeIndex > Math.floor(cards.length / 2)) {
                relativeIndex -= cards.length;
            }
            switch (relativeIndex) {
                case 0: card.classList.add('active'); break;
                case -1: card.classList.add('prev'); break;
                case 1: card.classList.add('next'); break;
                case -2: card.classList.add('prev-2'); break;
                case 2: card.classList.add('next-2'); break;
                default:
                    if (relativeIndex < -2) {
                        card.classList.add('hidden-prev');
                    } else {
                        card.classList.add('hidden-next');
                    }
                    break;
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });
    updateCarousel();
  }


  // --- Chatbot Logic (unchanged) ---
  const chatPopup = document.getElementById("aiChat");
  const openChatBtn = document.getElementById('open-chat-btn');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const sendChatBtn = document.getElementById('send-chat-btn');
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");
  const langButtons = document.querySelectorAll('.lang-btn');

  function smoothScrollToBottom() {
      chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
  }

  function showTypingIndicator() {
      const indicatorContainer = document.getElementById('typing-indicator-container');
      indicatorContainer.innerHTML = `
          <div class="message received" id="typing-indicator">
              <img src="images/agent-icon.png" class="agent-icon" alt="AI Agent">
              <div class="message-content">
                  <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
              </div>
          </div>
      `;
      smoothScrollToBottom();
  }

  function hideTypingIndicator() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) {
          indicator.remove();
      }
  }

  function addAiMessage(text) {
    const aiMessageElement = document.createElement("div");
    aiMessageElement.classList.add("message", "received");
    aiMessageElement.innerHTML = `
        <img src="images/agent-icon.png" class="agent-icon" alt="AI Agent">
        <div class="message-content">${text}</div>
    `;
    chatMessages.insertBefore(aiMessageElement, document.getElementById('typing-indicator-container'));
    smoothScrollToBottom();
  }
  
  function displayInitialMessage() {
      setTimeout(() => {
          addAiMessage("Hello! I'm the MedPAC assistant. How can I help you today?");
          isChatInitialized = true;
      }, 500); // Small delay for a better effect
  }

  function openChat() {
      chatPopup.classList.add("open");
      if (!isChatInitialized) {
          displayInitialMessage();
      }
  }

  function closeChat() {
      chatPopup.classList.remove("open");
  }

  async function sendMessage() {
    const message = userInput.value;
    if (message.trim() === "") return;

    const userMessageElement = document.createElement("div");
    userMessageElement.classList.add("message", "sent");
    userMessageElement.textContent = message;
    chatMessages.insertBefore(userMessageElement, document.getElementById('typing-indicator-container'));
    
    userInput.value = "";
    smoothScrollToBottom();
    showTypingIndicator();

    const activeButton = document.querySelector('#language-selector .lang-btn.active');
    const lang = activeButton ? activeButton.dataset.lang : 'en';

    try {
      const response = await fetch('https://medpac-backend.onrender.com/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, userId: chatUserId, lang: lang }),
      });

      if (!response.ok) {
        throw new Error("API response was not ok.");
      }

      const data = await response.json();
      chatUserId = data.userId; // Store user ID
      addAiMessage(data.reply);

    } catch (error) {
      console.error("Error fetching AI response:", error);
      addAiMessage("Sorry, something went wrong. Please try again.");
    } finally {
        hideTypingIndicator();
    }
  }

  openChatBtn.addEventListener('click', openChat);
  closeChatBtn.addEventListener('click', closeChat);
  sendChatBtn.addEventListener('click', sendMessage);

  userInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  langButtons.forEach(button => {
    button.addEventListener('click', () => {
        langButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
  });

});