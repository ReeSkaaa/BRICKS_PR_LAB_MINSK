document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded");

  // updates the date in the header
  const dateSpan = document.querySelector(".date-box span");
  const today = new Date();
  const formatted = today.toLocaleDateString("ru-RU");
  dateSpan.textContent = formatted;
});

// Toggle mobile menu visibility - will be operational letter
const toggleBtn = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.main-nav');

toggleBtn.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});


