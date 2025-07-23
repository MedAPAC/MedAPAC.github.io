document.addEventListener("DOMContentLoaded", function() {
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    const specialtyElement = document.querySelector("p.lead[data-specialties]");

    // Exit if the element doesn't exist
    if (!specialtyElement) return;

    const specialties = specialtyElement.dataset.specialties.split(',');
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let specialtyIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < specialties[specialtyIndex].length) {
            if (!cursorSpan.classList.contains("typing")) {
                cursorSpan.classList.add("typing");
            }
            typedTextSpan.textContent += specialties[specialtyIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) {
                cursorSpan.classList.add("typing");
            }
            typedTextSpan.textContent = specialties[specialtyIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            specialtyIndex++;
            if (specialtyIndex >= specialties.length) specialtyIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (specialties.length && specialties[0].length > 0) {
        setTimeout(type, newTextDelay / 2);
    }
});