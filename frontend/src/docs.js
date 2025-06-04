/**
 * Documentation Page JavaScript
 * Handles mobile menu, search functionality, and waitlist integration
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize mobile menu functionality
  setupMobileMenu();

  // Initialize search functionality
  setupDocumentationSearch();

  // Initialize waitlist button
  setupWaitlistButton();

  // Initialize smooth animations
  setupAnimations();

  // Initialize cross-page navigation
  setupCrossPageNavigation();
});

/**
 * Mobile menu functionality for docs page
 */
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  let isMenuOpen = false;

  if (!mobileMenuToggle || !mobileNav) return;

  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenuToggle.classList.toggle("active", isMenuOpen);
    mobileNav.classList.toggle("active", isMenuOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
  }

  function closeMobileMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      mobileMenuToggle.classList.remove("active");
      mobileNav.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Event listeners
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      !mobileNav.contains(e.target) &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking on nav links
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

/**
 * Search functionality for documentation
 */
function setupDocumentationSearch() {
  const searchInput = document.querySelector(".search-input");

  if (!searchInput) return;

  searchInput.addEventListener("input", function (e) {
    const query = e.target.value.trim();

    // For now, just show a placeholder behavior
    if (query.length > 2) {
      console.log("Searching for:", query);
      // TODO: Implement actual search functionality when docs are ready
    }
  });

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = e.target.value.trim();

      if (query.length > 0) {
        // Show a placeholder message for now
        alert(`Search functionality coming soon! You searched for: "${query}"`);
      }
    }
  });
}

/**
 * Waitlist button functionality
 */
function setupWaitlistButton() {
  const waitlistButton = document.querySelector(".docs-cta .btn-primary");

  if (!waitlistButton) return;

  waitlistButton.addEventListener("click", function () {
    // For now, redirect to the main page's waitlist
    // In the future, this could open a modal or redirect to a dedicated signup
    window.location.href = "index.html#waitlist";
  });
}

/**
 * Setup smooth animations and interactions
 */
function setupAnimations() {
  // Add hover effects to category cards
  const categoryCards = document.querySelectorAll(".docs-category-card");

  categoryCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      // Add a subtle animation when hovering over coming soon cards
      const icon = this.querySelector(".category-icon");
      if (icon) {
        icon.style.transform = "scale(1.1) rotate(5deg)";
        icon.style.transition = "all 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", function () {
      const icon = this.querySelector(".category-icon");
      if (icon) {
        icon.style.transform = "scale(1) rotate(0deg)";
      }
    });

    card.addEventListener("click", function () {
      // Show coming soon message when clicking on category cards
      const title = this.querySelector("h3").textContent;
      alert(`${title} documentation is coming soon! Stay tuned for updates.`);
    });
  });

  // Add animation to the mascot
  const mascotLogo = document.querySelector(".docs-mascot-logo");
  if (mascotLogo) {
    mascotLogo.addEventListener("click", function () {
      // Fun easter egg - make the mascot do a little spin
      this.style.transform = "rotate(360deg) scale(1.1)";
      this.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";

      setTimeout(() => {
        this.style.transform = "rotate(0deg) scale(1)";
      }, 600);
    });
  }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // If it's a link to the main page with an anchor
      if (href.includes("index.html#")) {
        // Let the browser handle the navigation
        return;
      }

      // For local anchors, handle smooth scrolling
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

/**
 * Setup cross-page navigation to handle links to main page sections
 */
function setupCrossPageNavigation() {
  // Get all navigation links with data-section and data-page attributes
  const navLinks = document.querySelectorAll(
    ".nav-link[data-section][data-page], .mobile-nav-link[data-section][data-page]"
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionIndex = parseInt(this.getAttribute("data-section"));
      const targetPage = this.getAttribute("data-page");

      if (targetPage === "index") {
        // Store the target section in sessionStorage so the main page can scroll to it
        sessionStorage.setItem("scrollToSection", sectionIndex.toString());

        // Navigate to the main page
        window.location.href = "index.html";
      }
    });
  });
}

// Initialize smooth scrolling
initializeSmoothScrolling();
