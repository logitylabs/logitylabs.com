/**
 * About Page JavaScript
 * Handles page-specific functionality and shared component initialization
 * Location: frontend/src/about.js
 */

// Import shared components
import { initializeSharedComponents } from "./shared.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize shared components first (navbar, footer, waitlist)
  initializeSharedComponents().then(() => {
    // Initialize about-specific functionality after shared components are loaded
    setupAboutSpecificFunctionality();
  });

  // Initialize about page functionality
  setupAboutAnimations();
  setupAboutInteractions();

  console.log("About page loaded successfully! 🚀");
});

/**
 * Setup about-specific functionality after shared components are loaded
 */
function setupAboutSpecificFunctionality() {
  // Setup about-specific waitlist buttons
  setupAboutWaitlistButtons();

  console.log("✅ About-specific functionality initialized");
}

/**
 * Setup additional waitlist buttons specific to about page
 */
function setupAboutWaitlistButtons() {
  // Handle about-specific waitlist buttons (if any exist)
  const aboutButtons = document.querySelectorAll(".hero .btn-primary");

  aboutButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      console.log("Opening waitlist modal from about page");

      // Access the global waitlist modal set by shared components
      if (window.waitlistModal) {
        window.waitlistModal.show("about-button");
      } else {
        console.error("Waitlist modal not initialized");
        alert("Please check back soon! We're setting up the waitlist.");
      }
    });
  });

  console.log("✅ Setup about-specific waitlist buttons");
}

/**
 * Setup about page animations
 */
function setupAboutAnimations() {
  // Add staggered animation to team member cards
  const teamMembers = document.querySelectorAll(
    '[style*="display: flex"][style*="align-items: flex-start"]'
  );

  teamMembers.forEach((member, index) => {
    // Set initial state for animation
    member.style.opacity = "0";
    member.style.transform = "translateY(20px)";

    // Add staggered animation
    setTimeout(
      () => {
        member.style.opacity = "1";
        member.style.transform = "translateY(0)";
        member.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      },
      index * 200 + 300
    ); // Delay for each team member
  });

  console.log("✅ About animations initialized");
}

/**
 * Setup about page interactions
 */
function setupAboutInteractions() {
  // Add hover effects to team member circles
  const teamCircles = document.querySelectorAll(
    '[style*="border-radius: 50%"][style*="background: linear-gradient"]'
  );

  teamCircles.forEach((circle) => {
    circle.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
      this.style.transition = "all 0.3s ease";
      this.style.boxShadow = "0 8px 24px rgba(45, 27, 14, 0.2)";
    });

    circle.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1) rotate(0deg)";
      this.style.boxShadow = "none";
    });
  });

  // Add click interaction for team members (fun easter egg)
  const teamMembers = document.querySelectorAll(
    '[style*="display: flex"][style*="align-items: flex-start"]'
  );

  teamMembers.forEach((member) => {
    member.addEventListener("click", function () {
      const circle = this.querySelector('[style*="border-radius: 50%"]');
      const name = this.querySelector("h3").textContent;

      if (circle) {
        // Fun animation when clicking on team member
        circle.style.transform = "scale(1.2) rotate(360deg)";
        circle.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

        setTimeout(() => {
          circle.style.transform = "scale(1) rotate(0deg)";
        }, 800);

        console.log(`👋 You clicked on ${name}!`);
      }
    });
  });

  console.log("✅ About interactions initialized");
}
