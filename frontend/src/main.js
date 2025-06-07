// Main JavaScript for Logity Landing Page - TikTok-Style Full-Screen Scrolling
// Handles TikTok-like section snapping, scroll indicators, and smooth navigation

// Import waitlist functionality
import { WaitlistModal } from "./components/WaitlistModal.js";
import { testConnection } from "./config/supabase.js";

// Global waitlist modal instance
let waitlistModal = null;

document.addEventListener("DOMContentLoaded", function () {
  // Ensure navbar is always visible on page load
  ensureNavbarVisible();

  // Initialize waitlist functionality
  initializeWaitlist();

  // Setup waitlist buttons
  setupWaitlistButtons();

  // Initialize TikTok-style scrolling
  initializeTikTokScrolling();

  // Setup scroll indicators with click functionality
  setupTikTokScrollIndicators();

  // Setup smooth scrolling for regular anchor links (if any)
  setupSmoothScrolling();

  // Setup navbar navigation
  setupNavbarNavigation();

  // Setup footer navigation
  setupFooterNavigation();

  // Setup cross-page navigation for secondary pages
  setupCrossPageNavigation();

  // Initialize fade-in animations
  setupFadeInAnimations();

  // Setup feature card interactions and modal
  setupUpdateCardInteractions();

  // Setup modal event listeners
  setupModalEventListeners();

  // Setup grid scroll protection
  setupGridScrollProtection();

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
      // Remove accordion functionality when not on mobile
      removeFooterAccordion();
    }
  });

  // Setup mobile landscape protection
  setupMobileLandscapeProtection();

  // Prevent zooming on mobile devices
  preventZooming();

  // Check for cross-page navigation (coming from docs page)
  checkCrossPageNavigation();

  // Setup contact sales modal
  setupContactSalesModal();

  console.log("Logity TikTok-style landing page loaded successfully! 🚀");
});

// Enhanced navbar background on scroll - keep consistent dark brown theme
// ALWAYS keep navbar visible and fixed
function ensureNavbarVisible() {
  const navbar = document.querySelector(".nav-header");

  if (navbar) {
    navbar.style.position = "fixed";
    navbar.style.top = "0";
    navbar.style.left = "0";
    navbar.style.right = "0";
    navbar.style.zIndex = "1000";
    navbar.style.transform = "translateY(0)";
    navbar.style.visibility = "visible";
    navbar.style.opacity = "1";
  }
}

// Also ensure navbar stays visible on resize (orientation change, etc.)
window.addEventListener("resize", ensureNavbarVisible);
window.addEventListener("orientationchange", ensureNavbarVisible);

window.addEventListener("scroll", function () {
  // Always ensure navbar stays visible
  ensureNavbarVisible();

  // Update background based on scroll position
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

// Initialize TikTok-style scrolling experience
function initializeTikTokScrolling() {
  const main = document.querySelector("main");
  const sections = document.querySelectorAll("section");
  let currentSection = 0;
  let isScrolling = false;

  // Track current section based on scroll position
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Array.from(sections).indexOf(entry.target);
          if (sectionIndex !== currentSection) {
            currentSection = sectionIndex;
            updateTikTokScrollIndicators(currentSection);
          }
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // Enhanced scroll handling for TikTok-like experience on both mobile and desktop
  let scrollTimer = null;
  let lastScrollY = 0;

  window.addEventListener(
    "scroll",
    (e) => {
      // Clear any existing timer
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      const currentScrollY = window.scrollY;

      // Add slight delay to prevent excessive snapping during user scrolling
      scrollTimer = setTimeout(
        () => {
          // TikTok-style section snapping logic for both mobile and desktop
          let closestSection = 0;
          let closestDistance = Infinity;

          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top);

            if (distance < closestDistance) {
              closestDistance = distance;
              closestSection = index;
            }
          });

          // Snap to the closest section if we're not already there
          // Use different thresholds for mobile vs desktop
          const threshold = window.innerWidth <= 768 ? 100 : 150;
          if (
            closestSection !== currentSection &&
            closestDistance > threshold
          ) {
            scrollToSection(closestSection);
          }
        },
        window.innerWidth <= 768 ? 100 : 200
      ); // Longer delay for desktop

      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  // Allow keyboard navigation (arrow keys)
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && currentSection < sections.length - 1) {
      e.preventDefault();
      scrollToSection(currentSection + 1);
    } else if (e.key === "ArrowUp" && currentSection > 0) {
      e.preventDefault();
      scrollToSection(currentSection - 1);
    }
  });

  // Desktop wheel navigation - ensure page navigation works even over grids
  let wheelAccumulator = 0;
  let wheelTimeout = null;

  window.addEventListener(
    "wheel",
    function (e) {
      // Only apply this logic for desktop
      if (window.innerWidth > 768) {
        wheelAccumulator += e.deltaY;

        // Clear existing timeout
        if (wheelTimeout) {
          clearTimeout(wheelTimeout);
        }

        // Set a timeout to process accumulated wheel delta
        wheelTimeout = setTimeout(() => {
          const threshold = 100; // Minimum scroll amount to trigger navigation

          if (Math.abs(wheelAccumulator) > threshold) {
            if (wheelAccumulator > 0 && currentSection < sections.length - 1) {
              // Scrolling down - go to next section
              scrollToSection(currentSection + 1);
            } else if (wheelAccumulator < 0 && currentSection > 0) {
              // Scrolling up - go to previous section
              scrollToSection(currentSection - 1);
            }
          }

          // Reset accumulator
          wheelAccumulator = 0;
        }, 100);
      }
    },
    { passive: true }
  );

  // Helper function to scroll to a specific section
  function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
      sections[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      currentSection = index;
      updateTikTokScrollIndicators(currentSection);
    }
  }
}

// Setup TikTok-style scroll indicators
function setupTikTokScrollIndicators() {
  const sections = document.querySelectorAll("section");
  const indicators = document.querySelector(".scroll-indicators");

  if (!indicators) return; // Indicators already exist in HTML

  const dots = indicators.querySelectorAll(".scroll-dot");

  // Add click handlers to existing dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      scrollToSectionByIndex(index);
    });
  });
}

// Update TikTok-style scroll indicators
function updateTikTokScrollIndicators(activeIndex) {
  const dots = document.querySelectorAll(".scroll-dot");

  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Helper function to scroll to section by index
function scrollToSectionByIndex(index) {
  const sections = document.querySelectorAll("section");
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

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
    });
  });
}

/**
 * Setup navbar navigation with TikTok-style section scrolling
 * Maps navigation links to specific section indices for smooth scrolling
 */
function setupNavbarNavigation() {
  // Get all navigation links (both desktop and mobile) and the logo
  const navLinks = document.querySelectorAll(
    ".nav-link[data-section], .mobile-nav-link[data-section]"
  );
  const logoLink = document.querySelector(".logo-link[data-section]");

  // Set up navigation link click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionIndex = parseInt(this.getAttribute("data-section"));

      // Navigate to the section using existing TikTok scrolling function
      scrollToSectionByIndex(sectionIndex);

      // Update scroll indicators immediately for better visual feedback
      updateTikTokScrollIndicators(sectionIndex);

      // Close mobile menu if it's open (for mobile navigation)
      if (this.classList.contains("mobile-nav-link")) {
        closeMobileMenu();
      }

      console.log(
        `Navigation: Scrolling to section ${sectionIndex} (${this.textContent})`
      );
    });
  });

  // Set up logo click handler to go to home/hero section
  if (logoLink) {
    logoLink.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionIndex = parseInt(this.getAttribute("data-section"));

      // Navigate to the hero section (index 0)
      scrollToSectionByIndex(sectionIndex);

      // Update scroll indicators immediately for better visual feedback
      updateTikTokScrollIndicators(sectionIndex);

      console.log(`Logo clicked: Scrolling to section ${sectionIndex} (Hero)`);
    });
  }

  console.log(
    `✅ Setup navbar navigation for ${navLinks.length} nav links + logo`
  );
}

// Setup footer navigation
function setupFooterNavigation() {
  // Get the footer pricing link with data-section attribute
  const footerPricingLink = document.querySelector(
    '.footer-links a[data-section="3"]'
  );

  if (footerPricingLink) {
    footerPricingLink.addEventListener("click", function (e) {
      e.preventDefault();

      const sectionIndex = parseInt(this.getAttribute("data-section"));

      // Navigate to the pricing section using existing TikTok scrolling function
      scrollToSectionByIndex(sectionIndex);

      // Update scroll indicators immediately for better visual feedback
      updateTikTokScrollIndicators(sectionIndex);

      console.log(
        `Footer Navigation: Scrolling to section ${sectionIndex} (Pricing)`
      );
    });
  }

  console.log("✅ Setup footer navigation for pricing link");
}

// Setup cross-page navigation for secondary pages
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

  console.log(`✅ Setup cross-page navigation for ${navLinks.length} links`);

  // Check if there's a stored section to scroll to (from other pages navigation)
  const targetSection = sessionStorage.getItem("scrollToSection");

  if (targetSection !== null) {
    // Remove the stored value to prevent future unintended scrolling
    sessionStorage.removeItem("scrollToSection");

    // Convert to number
    const sectionIndex = parseInt(targetSection);

    // Wait for the page to fully load, then scroll to the target section
    setTimeout(() => {
      scrollToSectionByIndex(sectionIndex);
      // Also update the scroll indicators
      updateTikTokScrollIndicators(sectionIndex);
    }, 100); // Small delay to ensure everything is loaded
  }
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
  closeBtn.addEventListener("click", closeFeatureModal);

  // Click outside to close
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeFeatureModal();
    }
  });

  // Escape key to close
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeFeatureModal();
    }
  });

  // Modal action buttons (placeholder functionality)
  document
    .getElementById("modal-learn-more")
    .addEventListener("click", function () {
      alert("Learn More functionality will be implemented here!");
    });

  document
    .getElementById("modal-try-feature")
    .addEventListener("click", function () {
      alert("Try Feature functionality will be implemented here!");
    });
}

// Simple grid scroll protection - prevents TikTok scrolling when mouse is over scrollable grids
function setupGridScrollProtection() {
  const updatesGrid = document.querySelector(".updates-grid");
  const featuredGrid = document.querySelector(".featured-grid");

  function setupGridProtection(grid) {
    if (!grid) return;

    let isActuallyScrollingInGrid = false;
    let gridScrollTimeout = null;
    let boundaryScrollTimeout = null;
    let lastWheelDirection = 0;
    let boundaryHitTime = 0;

    // Check if the grid actually has scrollable content
    function hasScrollableContent() {
      return grid.scrollHeight > grid.clientHeight;
    }

    // Check if we're at the top or bottom of the grid
    function isAtScrollBoundary() {
      const atTop = grid.scrollTop <= 1;
      const atBottom =
        grid.scrollTop >= grid.scrollHeight - grid.clientHeight - 1;
      return { atTop, atBottom, isAtBoundary: atTop || atBottom };
    }

    // Enhanced wheel event handler for better scroll delegation
    grid.addEventListener(
      "wheel",
      function (e) {
        // On desktop, be less aggressive about capturing scroll events
        const isDesktop = window.innerWidth > 768;

        // If no scrollable content, always allow main page scroll
        if (!hasScrollableContent()) {
          return; // Let the event bubble up for main page navigation
        }

        // For desktop, implement smart boundary detection with delay
        if (isDesktop) {
          const boundary = isAtScrollBoundary();
          const currentWheelDirection = e.deltaY > 0 ? 1 : -1; // 1 = down, -1 = up

          // If we're not at a boundary, always allow internal scrolling
          if (!boundary.isAtBoundary) {
            e.stopPropagation();
            return;
          }

          // We're at a boundary - check if user is trying to scroll out of the panel
          const tryingToScrollUp = currentWheelDirection < 0 && boundary.atTop;
          const tryingToScrollDown =
            currentWheelDirection > 0 && boundary.atBottom;

          if (tryingToScrollUp || tryingToScrollDown) {
            // Check if this is a continuation of the same scroll direction
            if (currentWheelDirection === lastWheelDirection) {
              const timeSinceBoundaryHit = Date.now() - boundaryHitTime;

              // If user has been scrolling in same direction for more than 300ms at boundary
              // then allow page navigation
              if (timeSinceBoundaryHit > 300) {
                return; // Let it bubble up for page navigation
              } else {
                // Still within delay period - prevent page navigation
                e.stopPropagation();
                return;
              }
            } else {
              // New scroll direction at boundary - reset timer
              boundaryHitTime = Date.now();
              lastWheelDirection = currentWheelDirection;
              e.stopPropagation();
              return;
            }
          } else {
            // Scrolling in direction that would stay within panel
            e.stopPropagation();
            return;
          }
        }

        // Mobile behavior - more traditional boundary checking
        const boundary = isAtScrollBoundary();
        if (boundary.isAtBoundary) {
          const scrollingUp = e.deltaY < 0;
          const scrollingDown = e.deltaY > 0;

          // Allow main page scroll if:
          // - Scrolling up while at top of grid
          // - Scrolling down while at bottom of grid
          if (
            (scrollingUp && boundary.atTop) ||
            (scrollingDown && boundary.atBottom)
          ) {
            return; // Let the event bubble up for main page navigation
          }
        }

        // Only prevent default and stop propagation for internal grid scrolling
        e.stopPropagation();
      },
      { passive: true }
    );

    // Track actual scroll events within the grid
    grid.addEventListener("scroll", function () {
      isActuallyScrollingInGrid = true;

      if (gridScrollTimeout) {
        clearTimeout(gridScrollTimeout);
      }

      gridScrollTimeout = setTimeout(() => {
        isActuallyScrollingInGrid = false;
      }, 150);
    });

    console.log(`Grid protection setup for: ${grid.className}`);
  }

  // Setup protection for both grids
  setupGridProtection(updatesGrid);
  setupGridProtection(featuredGrid);

  console.log("Enhanced grid scroll protection enabled");
}

// Mobile hamburger menu functionality
function setupMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  let isMenuOpen = false;

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

  // Close mobile menu
  function closeMobileMenu() {
    if (isMenuOpen) {
      toggleMobileMenu();
    }
  }

  // Event listeners
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);

  // Note: Navigation handling is now managed by setupNavbarNavigation()
  // No need for separate mobile nav link handlers here

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

  console.log("Mobile hamburger menu initialized! 📱");
}

// Mobile footer accordion functionality - Collapsible sections for small screens
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

      // No transform animations needed - absolute positioning handles the upward expansion
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

  // Initialize on orientation change (mobile)
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      initializeFooterAccordion();
    }, 500);
  });

  // Close accordion when pressing Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllFooterSections();
    }
  });
}

// Prevent zooming on both desktop and mobile devices
function preventZooming() {
  // Prevent keyboard zoom shortcuts (Ctrl/Cmd + Plus/Minus/0)
  document.addEventListener("keydown", function (e) {
    // Check for zoom keyboard shortcuts
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "+" || e.key === "-" || e.key === "0" || e.key === "=")
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // Prevent mouse wheel zoom (Ctrl/Cmd + wheel)
  document.addEventListener(
    "wheel",
    function (e) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { passive: false }
  );

  // Prevent touch zoom gestures on mobile
  document.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { passive: false }
  );

  // Prevent double-tap zoom on mobile
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (e) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  // Prevent gesturestart, gesturechange, gestureend events (iOS Safari)
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  document.addEventListener("gesturechange", function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  document.addEventListener("gestureend", function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  });

  console.log("Zoom prevention enabled for desktop and mobile! 🔒");
}

// Mobile landscape orientation prevention - JavaScript solution for real devices
function setupMobileLandscapeProtection() {
  // Only apply to mobile devices (not tablets or desktops)
  function isMobileDevice() {
    return (
      window.innerWidth <= 768 &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  function checkOrientation() {
    if (!isMobileDevice()) return;

    const isLandscape =
      window.innerWidth > window.innerHeight ||
      (screen.orientation && Math.abs(screen.orientation.angle) === 90) ||
      window.orientation === 90 ||
      window.orientation === -90;

    if (isLandscape) {
      // Add class to trigger CSS-based hiding
      document.body.classList.add("mobile-landscape-blocked");

      // Create overlay if it doesn't exist
      if (!document.querySelector(".orientation-overlay")) {
        createOrientationOverlay();
      }
    } else {
      // Remove class to show content
      document.body.classList.remove("mobile-landscape-blocked");

      // Remove overlay if it exists
      const overlay = document.querySelector(".orientation-overlay");
      if (overlay) {
        overlay.remove();
      }
    }
  }

  function createOrientationOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "orientation-overlay";
    overlay.innerHTML = `
      <div class="orientation-message">
        <div class="orientation-icon">📱</div>
        <h2>Please rotate your device</h2>
        <p>to portrait mode</p>
        <p class="orientation-subtitle">for the best experience</p>
      </div>
    `;

    // Apply styles directly
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #2d1b0e 0%, #1f0f08 100%);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    `;

    const message = overlay.querySelector(".orientation-message");
    message.style.cssText = `
      text-align: center;
      color: #f5e6d3;
      padding: 40px 20px;
      background: rgba(245, 230, 211, 0.1);
      border: 2px solid rgba(245, 230, 211, 0.3);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      max-width: 80vw;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    `;

    const icon = overlay.querySelector(".orientation-icon");
    icon.style.cssText = `
      font-size: 48px;
      margin-bottom: 20px;
      display: block;
    `;

    const title = overlay.querySelector("h2");
    title.style.cssText = `
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 10px 0;
      line-height: 1.3;
    `;

    const paragraphs = overlay.querySelectorAll("p");
    paragraphs.forEach((p) => {
      p.style.cssText = `
        font-size: 16px;
        margin: 0 0 8px 0;
        line-height: 1.4;
      `;
    });

    const subtitle = overlay.querySelector(".orientation-subtitle");
    subtitle.style.cssText = `
      font-size: 14px;
      opacity: 0.8;
      margin-top: 10px !important;
    `;

    document.body.appendChild(overlay);
  }

  // Check orientation on load and orientation changes
  checkOrientation();

  // Listen for orientation changes
  window.addEventListener("orientationchange", () => {
    // Small delay to ensure the orientation change is complete
    setTimeout(checkOrientation, 100);
  });

  // Also listen for resize as a fallback
  window.addEventListener("resize", checkOrientation);

  // Listen for screen orientation API if available
  if (screen.orientation) {
    screen.orientation.addEventListener("change", checkOrientation);
  }

  console.log("📱 Mobile landscape protection enabled for real devices");
}

// Initialize mobile landscape protection
setupMobileLandscapeProtection();

// Export functions for potential external use
window.logityScrolling = {
  scrollToSection: scrollToSectionByIndex,
  getCurrentSection: () => {
    const sections = document.querySelectorAll("section");
    let currentIndex = 0;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
      ) {
        currentIndex = index;
      }
    });

    return currentIndex;
  },
};

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
