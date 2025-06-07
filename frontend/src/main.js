// Main JavaScript for Logity Landing Page - Standard Web Scrolling
// Handles essential functionality without TikTok-style features

// Import waitlist functionality
import { WaitlistModal } from "./components/WaitlistModal.js";
import { testConnection } from "./config/supabase.js";

// Global waitlist modal instance
let waitlistModal = null;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize waitlist functionality
  initializeWaitlist();

  // Setup waitlist buttons
  setupWaitlistButtons();

  // Setup smooth scrolling for navigation links
  setupSmoothScrolling();

  // Setup navbar navigation
  setupNavbarNavigation();

  // Setup footer navigation
  setupFooterNavigation();

  // Initialize fade-in animations
  setupFadeInAnimations();

  // Setup feature card interactions and modal
  setupUpdateCardInteractions();

  // Setup modal event listeners
  setupModalEventListeners();

  // Setup mobile menu
  setupMobileMenu();

  // Setup mobile footer accordion for mobile devices
  if (window.innerWidth <= 768) {
    setupMobileFooterAccordion();
  }

  // Handle window resize to toggle footer accordion
  window.addEventListener("resize", function () {
    if (window.innerWidth <= 768) {
      setupMobileFooterAccordion();
    } else {
      removeFooterAccordion();
    }
  });

  // Setup contact sales modal
  setupContactSalesModal();

  console.log("Logity landing page loaded successfully! 🚀");
});

// Enhanced navbar background on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".nav-header");
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background =
        "linear-gradient(135deg, #2d1b0e 0%, #1f0f08 100%)";
      navbar.style.boxShadow = "0 2px 20px rgba(45, 27, 14, 0.3)";
    } else {
      navbar.style.background =
        "linear-gradient(135deg, #2d1b0e 0%, #1f0f08 100%)";
      navbar.style.boxShadow = "none";
    }
  }
});

/**
 * Initialize waitlist functionality
 */
async function initializeWaitlist() {
  try {
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
    waitlistModal = new WaitlistModal();
    console.log("✅ Waitlist modal initialized");
  } catch (error) {
    console.error("❌ Error initializing waitlist modal:", error);
  }
}

/**
 * Setup waitlist button click handlers
 */
function setupWaitlistButtons() {
  // Select all "Try logity" buttons
  const waitlistButtons = document.querySelectorAll(".btn-primary");

  waitlistButtons.forEach((button, index) => {
    // Determine button source for analytics
    let source = "unknown";

    // Check button location to set appropriate source
    if (button.closest(".nav-header")) {
      source = "nav-button";
    } else if (button.closest(".hero")) {
      source = "hero-button";
    } else if (button.closest(".cta-section")) {
      source = "cta-button";
    } else if (button.classList.contains("mobile-cta")) {
      source = "mobile-nav-button";
    }

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
  });

  console.log(`✅ Setup ${waitlistButtons.length} waitlist buttons`);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll(
    '.nav-link[href^="#"], .mobile-nav-link[href^="#"]'
  );

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      // Close mobile menu if it's open
      if (this.classList.contains("mobile-nav-link")) {
        closeMobileMenu();
      }
    });
  });
}

/**
 * Setup navbar navigation with smooth scrolling
 */
function setupNavbarNavigation() {
  // Get all navigation links (both desktop and mobile) and the logo
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  const logoLink = document.querySelector(".logo-link");

  // Set up navigation link click handlers
  navLinks.forEach((link) => {
    // Skip if it's already handled by setupSmoothScrolling
    if (
      link.getAttribute("href") &&
      link.getAttribute("href").startsWith("#")
    ) {
      return;
    }

    link.addEventListener("click", function (e) {
      // Only handle special navigation, let normal links work normally
      const href = this.getAttribute("href");

      // Close mobile menu if it's open (for mobile navigation)
      if (this.classList.contains("mobile-nav-link")) {
        closeMobileMenu();
      }
    });
  });

  // Set up logo click handler
  if (logoLink) {
    logoLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  console.log("✅ Setup navbar navigation");
}

// Setup footer navigation
function setupFooterNavigation() {
  const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');

  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  console.log("✅ Setup footer navigation");
}

// Setup fade-in animations for elements
function setupFadeInAnimations() {
  const animatedElements = document.querySelectorAll(
    ".update-card, .stat-card, .featured-article"
  );

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animatedElements.forEach((element) => {
    fadeObserver.observe(element);
  });
}

// Setup interactive card effects with modal
function setupUpdateCardInteractions() {
  const updateCards = document.querySelectorAll(".update-card");

  // Feature data for the modal
  const featureData = {
    "AI Analysis": {
      icon: "🤖",
      category: "Core Feature",
      description:
        "Advanced machine learning algorithms detect patterns and anomalies automatically in your automotive logs.",
      features: [
        "Pattern recognition for the log files",
        "Anomaly detection using neural networks",
        "Automated fault classification",
        "Choose your favourite model for the analysis",
      ],
    },
    "Protocol Support": {
      icon: "🔍",
      category: "Connectivity",
      description:
        "Analyze DoIP and PCAP files in one unified platform with comprehensive protocol support.",
      features: [
        "DoIP (Diagnostics over IP) parsing",
        "PCAP file analysis and visualization",
        "Multi-protocol session correlation",
        "Protocol-specific filtering and search",
        "Export capabilities for different formats",
      ],
    },
    "Plain-Language Explanations": {
      icon: "💬",
      category: "User Experience",
      description:
        "Get clear, understandable insights without technical jargon that make complex data accessible.",
      features: [
        "Natural language fault descriptions",
        "Context-aware explanations",
        "Technical term glossary integration",
        "Severity level indicators",
        "Actionable resolution suggestions",
      ],
    },
    "Real-Time Processing": {
      icon: "⚡",
      category: "Performance",
      description:
        "Process large automotive log files quickly with optimized parsing engines.",
      features: [
        "High-speed log file processing",
        "Streaming data analysis",
        "Memory-efficient algorithms",
        "Parallel processing capabilities",
        "Real-time visualization updates",
      ],
    },
    "Extended Protocol Support": {
      icon: "🚧",
      category: "Upcoming",
      description:
        "CAN and DLT log analysis coming in future releases with extended protocol coverage.",
      features: [
        "CAN bus message parsing",
        "DLT (Diagnostic Log and Trace) support",
        "LIN protocol analysis",
        "FlexRay network debugging",
        "Automotive Ethernet protocols",
      ],
    },
    "Interactive Visualizations": {
      icon: "📊",
      category: "Upcoming",
      description:
        "Explore data with interactive charts and signal visualizations for better insights.",
      features: [
        "Interactive timeline visualizations",
        "Signal waveform displays",
        "Network topology mapping",
        "Custom dashboard creation",
        "Export to popular visualization tools",
      ],
    },
    "Enterprise Security": {
      icon: "🔒",
      category: "Upcoming",
      description:
        "Enterprise-grade security with automotive industry compliance and data protection.",
      features: [
        "ISO 26262 compliance support",
        "End-to-end encryption",
        "Role-based access control",
        "Audit logging and compliance",
        "Secure cloud deployment options",
      ],
    },
    "Fine-Tuned Proprietary Model": {
      icon: "🔧",
      category: "Upcoming",
      description:
        "Our proprietary AI model, specifically fine-tuned on millions of automotive log entries, delivers unparalleled accuracy in fault detection and root cause analysis.",
      features: [
        "Automotive-specific language model trained on the most common protocols",
        "Accuracy in fault classification across major vehicle manufacturers",
        "Deep understanding of automotive system relationships and dependencies",
        "Specialized knowledge of OEM-specific diagnostic codes and patterns",
        "Continuous learning from anonymized industry log data",
      ],
    },
    "Beauty as an Asset": {
      icon: "💄",
      category: "User Experience",
      description:
        "Enterprise software is usually designed with KPIs in mind. Logity is designed with the user in mind, prioritizing intuitive design and delightful user experiences.",
      features: [
        "Clean, intuitive interface that reduces cognitive load",
        "Thoughtful color palette and typography for extended use",
        "Responsive design that works beautifully on all devices",
        "Accessibility-first approach for inclusive user experience",
        "Smooth animations and micro-interactions that feel natural",
        "User-centered design process with continuous feedback integration",
      ],
    },
  };

  updateCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();

      // Get feature details
      const featureTitle = this.querySelector("h3").textContent.trim();
      const featureInfo = featureData[featureTitle];

      if (featureInfo) {
        openFeatureModal(featureTitle, featureInfo);
      }

      // Remove selected class from all cards
      updateCards.forEach((c) => c.classList.remove("selected"));

      // Add selected class to clicked card
      this.classList.add("selected");
    });

    // Add keyboard navigation
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });

    // Make cards focusable
    card.setAttribute("tabindex", "0");
  });
}

// Modal functionality
function openFeatureModal(title, featureInfo) {
  const modal = document.getElementById("feature-modal");
  const modalIcon = document.getElementById("modal-icon");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalDescription = document.getElementById("modal-description");
  const modalFeatures = document.getElementById("modal-features");

  // Update modal content
  modalIcon.textContent = featureInfo.icon;
  modalTitle.textContent = title;
  modalCategory.textContent = featureInfo.category;
  modalDescription.textContent = featureInfo.description;

  // Update features list
  modalFeatures.innerHTML = "";
  featureInfo.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    modalFeatures.appendChild(li);
  });

  // Show modal with animation
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
}

function closeFeatureModal() {
  const modal = document.getElementById("feature-modal");

  modal.classList.remove("active");
  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }, 300);
}

// Setup modal event listeners
function setupModalEventListeners() {
  const modal = document.getElementById("feature-modal");
  const closeBtn = document.getElementById("close-modal");
  const modalOverlay = modal;

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeFeatureModal);
  }

  // Click outside to close
  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) {
        closeFeatureModal();
      }
    });
  }

  // Escape key to close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeFeatureModal();
    }
  });

  // Modal action buttons (placeholder functionality)
  const learnMoreBtn = document.getElementById("modal-learn-more");
  const tryFeatureBtn = document.getElementById("modal-try-feature");

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", function () {
      alert("Learn More functionality will be implemented here!");
    });
  }

  if (tryFeatureBtn) {
    tryFeatureBtn.addEventListener("click", function () {
      alert("Try Feature functionality will be implemented here!");
    });
  }
}

// Mobile hamburger menu functionality
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  let isMenuOpen = false;

  // Close mobile menu
  function closeMobileMenu() {
    if (isMenuOpen) {
      toggleMobileMenu();
    }
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;

    // Toggle classes for animation
    mobileMenuToggle.classList.toggle("active", isMenuOpen);
    mobileNav.classList.toggle("active", isMenuOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    // Update aria attributes for accessibility
    mobileMenuToggle.setAttribute("aria-expanded", isMenuOpen);
    mobileNav.setAttribute("aria-hidden", !isMenuOpen);
  }

  // Event listeners
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      isMenuOpen &&
      mobileNav &&
      !mobileNav.contains(e.target) &&
      mobileMenuToggle &&
      !mobileMenuToggle.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Close menu on window resize to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && isMenuOpen) {
      closeMobileMenu();
    }
  });

  // Make closeMobileMenu available globally
  window.closeMobileMenu = closeMobileMenu;

  console.log("Mobile hamburger menu initialized! 📱");
}

// Mobile footer accordion functionality
function setupMobileFooterAccordion() {
  // Create overlay element for dimmed background effect
  function createFooterOverlay() {
    let overlay = document.querySelector(".footer-accordion-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "footer-accordion-overlay";
      document.body.appendChild(overlay);

      // Add click listener to close accordion when clicking overlay
      overlay.addEventListener("click", function (e) {
        // Make sure we're clicking on the overlay itself, not on the footer menu
        const footerMain = document.querySelector(".footer-main");
        if (footerMain && !footerMain.contains(e.target)) {
          closeAllFooterSections();
        }
      });
    }
    return overlay;
  }

  // Function to close all open footer sections
  function closeAllFooterSections() {
    const footerSections = document.querySelectorAll(".footer-section");
    const overlay = document.querySelector(".footer-accordion-overlay");

    footerSections.forEach((section) => {
      const title = section.querySelector(".footer-title");
      const content = section.querySelector(".footer-links");

      if (title?.getAttribute("aria-expanded") === "true") {
        // Close the section
        section.classList.remove("open");
        title.setAttribute("aria-expanded", "false");
        content.setAttribute("aria-hidden", "true");
        content.style.maxHeight = "0";
        content.style.opacity = "0";
      }
    });

    // Hide overlay and remove body blocking
    if (overlay) {
      overlay.classList.remove("active");
    }
    document.body.classList.remove("footer-accordion-open");
  }

  // Only initialize on mobile screens (768px and below)
  function initializeFooterAccordion() {
    if (window.innerWidth > 768) {
      // Remove accordion functionality on larger screens
      removeFooterAccordion();
      return;
    }

    // Create overlay element
    const overlay = createFooterOverlay();

    const footerSections = document.querySelectorAll(".footer-section");

    footerSections.forEach((section, index) => {
      const title = section.querySelector(".footer-title");
      const links = section.querySelector(".footer-links");

      if (!title || !links) return;

      // Add accordion classes and attributes
      section.classList.add("footer-accordion-section");
      title.classList.add("footer-accordion-toggle");
      links.classList.add("footer-accordion-content");

      // Add ARIA attributes for accessibility
      title.setAttribute("role", "button");
      title.setAttribute("aria-expanded", "false");
      title.setAttribute("aria-controls", `footer-content-${index}`);
      title.setAttribute("tabindex", "0");

      links.setAttribute("id", `footer-content-${index}`);
      links.setAttribute("aria-hidden", "true");

      // Remove any existing arrows (clean slate)
      const existingArrow = title.querySelector(".footer-arrow");
      if (existingArrow) {
        existingArrow.remove();
      }

      // Set initial state (all closed)
      links.style.maxHeight = "0";
      links.style.overflow = "hidden";
      links.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
      links.style.opacity = "0";

      // Click event listener
      title.addEventListener("click", function () {
        toggleFooterSection(section, index);
      });

      // Keyboard accessibility
      title.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFooterSection(section, index);
        }
      });
    });

    console.log("Mobile footer accordion initialized! 📱");
  }

  function toggleFooterSection(clickedSection, clickedIndex) {
    const footerSections = document.querySelectorAll(".footer-section");
    const clickedTitle = clickedSection.querySelector(".footer-title");
    const clickedContent = clickedSection.querySelector(".footer-links");
    const overlay = document.querySelector(".footer-accordion-overlay");

    const isCurrentlyOpen =
      clickedTitle.getAttribute("aria-expanded") === "true";

    // Close all other sections first (accordion behavior - only one open at a time)
    footerSections.forEach((section, index) => {
      if (index !== clickedIndex) {
        const title = section.querySelector(".footer-title");
        const content = section.querySelector(".footer-links");

        // Close other sections
        section.classList.remove("open");
        title.setAttribute("aria-expanded", "false");
        content.setAttribute("aria-hidden", "true");
        content.style.maxHeight = "0";
        content.style.opacity = "0";
      }
    });

    // Toggle the clicked section
    if (isCurrentlyOpen) {
      // Close the clicked section
      clickedSection.classList.remove("open");
      clickedTitle.setAttribute("aria-expanded", "false");
      clickedContent.setAttribute("aria-hidden", "true");
      clickedContent.style.maxHeight = "0";
      clickedContent.style.opacity = "0";

      // Hide overlay and remove body blocking
      if (overlay) {
        overlay.classList.remove("active");
      }
      document.body.classList.remove("footer-accordion-open");
    } else {
      // Open the clicked section
      clickedSection.classList.add("open");
      clickedTitle.setAttribute("aria-expanded", "true");
      clickedContent.setAttribute("aria-hidden", "false");

      // Calculate the natural height of the content and apply it
      const scrollHeight = clickedContent.scrollHeight;
      clickedContent.style.maxHeight = scrollHeight + "px";
      clickedContent.style.opacity = "1";

      // Show overlay and add body blocking
      if (overlay) {
        overlay.classList.add("active");
      }
      document.body.classList.add("footer-accordion-open");
    }
  }

  function removeFooterAccordion() {
    const footerSections = document.querySelectorAll(".footer-section");
    const overlay = document.querySelector(".footer-accordion-overlay");

    // Remove overlay
    if (overlay) {
      overlay.remove();
    }

    footerSections.forEach((section) => {
      const title = section.querySelector(".footer-title");
      const links = section.querySelector(".footer-links");
      const arrow = title?.querySelector(".footer-arrow");

      // Remove accordion classes and styles
      section.classList.remove("footer-accordion-section", "open");
      title?.classList.remove("footer-accordion-toggle");
      links?.classList.remove("footer-accordion-content");

      // Remove ARIA attributes
      title?.removeAttribute("role");
      title?.removeAttribute("aria-expanded");
      title?.removeAttribute("aria-controls");
      title?.removeAttribute("tabindex");
      links?.removeAttribute("aria-hidden");

      // Reset styles
      if (links) {
        links.style.maxHeight = "";
        links.style.overflow = "";
        links.style.transition = "";
        links.style.opacity = "";
      }

      // Remove arrow if it exists
      if (arrow) {
        arrow.remove();
      }

      // Remove event listeners by cloning and replacing elements
      if (title) {
        const newTitle = title.cloneNode(true);
        title.parentNode.replaceChild(newTitle, title);
      }
    });
  }

  // Initialize on page load
  initializeFooterAccordion();

  // Re-initialize on window resize
  window.addEventListener("resize", () => {
    // Debounce resize events
    clearTimeout(window.footerResizeTimeout);
    window.footerResizeTimeout = setTimeout(() => {
      initializeFooterAccordion();
    }, 250);
  });

  // Close accordion when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllFooterSections();
    }
  });

  // Make removeFooterAccordion available globally
  window.removeFooterAccordion = removeFooterAccordion;
}

// Setup contact sales modal
function setupContactSalesModal() {
  const modal = document.getElementById("contact-sales-modal");
  const contactBtn = document.getElementById("contact-sales-btn");
  const contactPricingBtn = document.getElementById(
    "contact-sales-pricing-btn"
  );
  const closeBtn = document.getElementById("close-contact-modal");
  const closeActionBtn = document.getElementById("contact-close-btn");
  const emailBtn = document.getElementById("contact-email-btn");

  function openContactModal() {
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.add("active");
      }, 10);
      document.body.style.overflow = "hidden";
    }
  }

  function closeContactModalFunc() {
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }, 300);
    }
  }

  // Setup event listeners for both buttons
  if (contactBtn) {
    contactBtn.addEventListener("click", openContactModal);
  }

  if (contactPricingBtn) {
    contactPricingBtn.addEventListener("click", openContactModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeContactModalFunc);
  }

  if (closeActionBtn) {
    closeActionBtn.addEventListener("click", closeContactModalFunc);
  }

  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      window.location.href = "mailto:silvio.dacol@outlook.com";
    });
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeContactModalFunc();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeContactModalFunc();
    }
  });
}
