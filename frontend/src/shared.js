/**
 * Shared Components Initializer for Logity Website
 * This script loads the shared navbar and footer on all pages
 * Location: frontend/src/shared.js
 */

import { SharedFooter } from "./components/SharedFooter.js";
import { SharedNavbar } from "./components/SharedNavbar.js";
import { WaitlistModal } from "./components/WaitlistModal.js";

// Supabase testConnection will be loaded dynamically

// Global shared components
let sharedNavbar = null;
let sharedFooter = null;
let waitlistModal = null;

/**
 * Initialize shared components for all pages
 */
export async function initializeSharedComponents() {
  console.log("🚀 Initializing shared components...");

  try {
    // Initialize navbar
    sharedNavbar = new SharedNavbar();
    sharedNavbar.render();
    console.log("✅ Shared navbar loaded");

    // Show main content now that navbar is loaded
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.classList.add("loaded");
      console.log("✅ Main content shown after navbar load");
    }

    // Initialize footer
    sharedFooter = new SharedFooter();
    sharedFooter.render();
    console.log("✅ Shared footer loaded");

    // Initialize waitlist functionality
    await initializeWaitlistFunctionality();

    // Setup shared functionality
    setupSharedWaitlistButtons();
    setupSharedModalEventListeners();

    console.log("🎉 All shared components initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing shared components:", error);
  }
}

/**
 * Initialize waitlist functionality
 */
async function initializeWaitlistFunctionality() {
  let testConnection;

  try {
    // Dynamic import of Supabase configuration based on environment
    console.log("Loading Supabase configuration...");

    try {
      // Try to import the main supabase config (works in Vite development)
      const { testConnection: devTestConnection } = await import(
        "./config/supabase.js"
      );
      testConnection = devTestConnection;
      console.log("✅ Using development Supabase configuration");
    } catch (error) {
      console.log("🔄 Development config failed, trying CDN version...");
      try {
        // Fallback to CDN version for production
        const { testConnection: cdnTestConnection } = await import(
          "./config/supabase-cdn.js"
        );
        testConnection = cdnTestConnection;
        console.log("✅ Using CDN Supabase configuration");
      } catch (cdnError) {
        console.error("❌ Both Supabase configs failed:", error, cdnError);
        throw new Error("Supabase configuration could not be loaded");
      }
    }

    // Test Supabase connection
    console.log("Testing Supabase connection...");
    const connectionTest = await testConnection();

    if (connectionTest) {
      console.log("✅ Supabase connected successfully");
    } else {
      console.warn(
        "⚠️ Supabase connection test failed - check your configuration"
      );
    }
  } catch (error) {
    console.error("❌ Error testing Supabase connection:", error);
    console.warn("Please check your Supabase configuration in .env.local");
  }

  try {
    // Always initialize waitlist modal, even if Supabase connection fails
    console.log("🔧 Creating WaitlistModal instance...");
    waitlistModal = new WaitlistModal();

    // Make waitlist modal available globally for footer and other components
    window.waitlistModal = waitlistModal;

    console.log(
      "✅ Waitlist modal initialized and set to window.waitlistModal:",
      window.waitlistModal
    );
  } catch (error) {
    console.error("❌ Error initializing waitlist modal:", error);
    console.error("Error details:", error.stack);
  }
}

/**
 * Setup waitlist button click handlers for shared buttons
 */
function setupSharedWaitlistButtons() {
  // Select all "Try logity" buttons that are in shared components
  const waitlistButtons = document.querySelectorAll(".btn-primary");

  waitlistButtons.forEach((button, index) => {
    // Determine button source for analytics
    let source = "unknown";

    // Check button location to set appropriate source
    if (button.closest(".nav-header")) {
      source = "nav-button";
    } else if (button.closest(".cta-section")) {
      source = "footer-cta-button";
    } else if (button.classList.contains("mobile-cta")) {
      source = "mobile-nav-button";
    }

    // Only handle shared component buttons
    if (source !== "unknown") {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        console.log(`Opening waitlist modal from: ${source}`);

        // Show waitlist modal
        if (waitlistModal) {
          waitlistModal.show(source);
        } else {
          console.error("Waitlist modal not initialized");
          // Fallback behavior
          alert("Please check back soon! We're setting up the waitlist.");
        }
      });
    }
  });

  console.log("✅ Setup shared waitlist buttons");
}

/**
 * Setup shared modal event listeners (feature modals, etc.)
 */
function setupSharedModalEventListeners() {
  // Feature modal functionality (if it exists on the page)
  const featureModal = document.getElementById("feature-modal");

  if (featureModal) {
    const closeBtn = document.getElementById("close-modal");

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener("click", closeFeatureModal);
    }

    // Click outside to close
    featureModal.addEventListener("click", function (e) {
      if (e.target === featureModal) {
        closeFeatureModal();
      }
    });

    // Escape key to close
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && featureModal.classList.contains("active")) {
        closeFeatureModal();
      }
    });

    console.log("✅ Feature modal event listeners setup");
  }
}

/**
 * Close feature modal function (used by feature modal functionality)
 */
function closeFeatureModal() {
  const modal = document.getElementById("feature-modal");
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
      // Use standardized scroll restoration
      restoreBodyScroll();
    }, 300);
  }
}

/**
 * Centralized modal scroll management
 */
function preventBodyScroll() {
  // Remove any existing inline overflow styles that might conflict
  document.body.style.overflow = "";
  // Use CSS class for consistent behavior
  document.body.classList.add("modal-open");
  console.log("🔒 Body scroll disabled");
}

function restoreBodyScroll() {
  // Remove CSS class
  document.body.classList.remove("modal-open");
  // Ensure any inline styles are also cleared
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  // Additional safety check - force scroll restoration
  setTimeout(() => {
    if (!document.body.classList.contains("modal-open")) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, 100);

  console.log("🔓 Body scroll restored");
}

// Export scroll management functions for use in other components
window.preventBodyScroll = preventBodyScroll;
window.restoreBodyScroll = restoreBodyScroll;

/**
 * Get current page name (utility function)
 */
export function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split("/").pop().split(".")[0];
  return filename || "index";
}

// Export components for use in individual page scripts
export { sharedFooter, sharedNavbar, waitlistModal };
