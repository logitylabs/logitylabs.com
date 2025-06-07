// Main JavaScript for Logity Landing Page - Standard Web Scrolling
// Handles essential functionality without TikTok-style features

// Import shared components and functionality
import { initializeSharedComponents } from "./shared.js";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize shared components first (navbar, footer, waitlist)
  initializeSharedComponents().then(() => {
    // Setup homepage-specific waitlist buttons after shared components are loaded
    setupHomepageWaitlistButtons();

    // Handle hash navigation after components are loaded
    handleHashNavigation();
  });

  // Setup smooth scrolling for navigation links
  setupSmoothScrolling();

  // Setup navbar navigation (additional homepage-specific logic)
  setupNavbarNavigation();

  // Setup footer navigation (additional homepage-specific logic)
  setupFooterNavigation();

  // Initialize fade-in animations
  setupFadeInAnimations();

  // Setup feature card interactions and modal
  setupUpdateCardInteractions();

  // Setup modal event listeners
  setupModalEventListeners();

  // Contact sales modal is now handled by SharedFooter component

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
 * Setup additional waitlist buttons specific to homepage
 */
function setupHomepageWaitlistButtons() {
  // Handle homepage-specific waitlist buttons (hero section, etc.)
  const heroButtons = document.querySelectorAll(".hero .btn-primary");

  console.log(`Found ${heroButtons.length} hero buttons to setup`);

  heroButtons.forEach((button, index) => {
    console.log(`Setting up hero button ${index + 1}:`, button);

    button.addEventListener("click", function (e) {
      e.preventDefault();

      console.log(
        "🔥 Hero button clicked - Opening waitlist modal from hero section"
      );

      // Access the global waitlist modal set by shared components
      if (window.waitlistModal) {
        console.log("✅ Waitlist modal found, showing...");
        try {
          window.waitlistModal.show("hero-button");
          console.log("✅ Waitlist modal show() called successfully");
        } catch (error) {
          console.error("❌ Error calling waitlist modal show():", error);
          alert("Something went wrong opening the waitlist. Please try again.");
        }
      } else {
        console.error(
          "❌ Waitlist modal not initialized - window.waitlistModal is:",
          window.waitlistModal
        );
        alert("Please check back soon! We're setting up the waitlist.");
      }
    });
  });

  console.log(
    `✅ Setup ${heroButtons.length} homepage-specific waitlist buttons`
  );
}

/**
 * Handle hash navigation when arriving from other pages
 * This ensures that when users click Features/Pricing from other pages,
 * the main page scrolls to the correct section
 */
function handleHashNavigation() {
  // Check if there's a hash in the current URL
  const hash = window.location.hash;

  if (hash) {
    // Wait a bit for the page to fully render, then scroll to the target
    setTimeout(() => {
      const targetElement = document.querySelector(hash);

      if (targetElement) {
        console.log(`Scrolling to section: ${hash}`);
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        console.warn(`Target element not found for hash: ${hash}`);
      }
    }, 500); // Small delay to ensure page is fully loaded
  }

  console.log("✅ Hash navigation handling initialized");
}

// Listen for hash changes (browser back/forward buttons)
window.addEventListener("hashchange", function () {
  const hash = window.location.hash;

  if (hash) {
    const targetElement = document.querySelector(hash);

    if (targetElement) {
      console.log(`Hash changed, scrolling to: ${hash}`);
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

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

  // Prevent body scroll when modal is open - use centralized method
  if (window.preventBodyScroll) {
    window.preventBodyScroll();
  } else {
    document.body.classList.add("modal-open");
  }
}

function closeFeatureModal() {
  const modal = document.getElementById("feature-modal");

  modal.classList.remove("active");
  setTimeout(() => {
    modal.style.display = "none";
    // Restore body scroll - use centralized method
    if (window.restoreBodyScroll) {
      window.restoreBodyScroll();
    } else {
      document.body.classList.remove("modal-open");
    }
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

// Mobile menu functionality is now handled by SharedNavbar component

// Mobile footer accordion functionality is now handled by SharedFooter component

// Contact sales modal functionality is now handled by SharedFooter component
