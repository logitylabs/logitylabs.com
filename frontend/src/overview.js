/**
 * Overview Page JavaScript
 * Handles page-specific functionality and shared component initialization
 * Location: frontend/src/overview.js
 */

// Import shared components
import { initializeSharedComponents } from "./shared.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize shared components first (navbar, footer, waitlist)
  initializeSharedComponents().then(() => {
    // Initialize overview-specific functionality after shared components are loaded
    setupOverviewSpecificFunctionality();
  });

  // Initialize overview page functionality
  setupOverviewAnimations();
  setupOverviewInteractions();

  console.log("Overview page loaded successfully! 🚀");
});

/**
 * Setup overview-specific functionality after shared components are loaded
 */
function setupOverviewSpecificFunctionality() {
  // Setup overview-specific waitlist buttons
  setupOverviewWaitlistButtons();

  console.log("✅ Overview-specific functionality initialized");
}

/**
 * Setup additional waitlist buttons specific to overview page
 */
function setupOverviewWaitlistButtons() {
  // Handle overview-specific waitlist buttons (hero section, etc.)
  const overviewButtons = document.querySelectorAll(".hero .btn-primary");

  overviewButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      console.log("Opening waitlist modal from overview page");

      // Access the global waitlist modal set by shared components
      if (window.waitlistModal) {
        window.waitlistModal.show("overview-button");
      } else {
        console.error("Waitlist modal not initialized");
        alert("Please check back soon! We're setting up the waitlist.");
      }
    });
  });

  console.log("✅ Setup overview-specific waitlist buttons");
}

/**
 * Setup overview page animations
 */
function setupOverviewAnimations() {
  // Add animation to feature cards
  const featureCards = document.querySelectorAll(
    '[style*="text-align: center"]'
  );

  featureCards.forEach((card, index) => {
    // Add a subtle delay for staggered animation
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
      card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    }, index * 200);
  });

  console.log("✅ Overview animations initialized");
}

/**
 * Setup overview page interactions
 */
function setupOverviewInteractions() {
  // Add hover effects to feature icons
  const featureIcons = document.querySelectorAll(
    '[style*="border-radius: 50%"]'
  );

  featureIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
      this.style.transition = "all 0.3s ease";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
    });
  });

  console.log("✅ Overview interactions initialized");
}
