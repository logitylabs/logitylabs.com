// Main JavaScript for Logity Landing Page - TikTok-Style Full-Screen Scrolling
// Handles TikTok-like section snapping, scroll indicators, and smooth navigation

// Import waitlist functionality
import { WaitlistModal } from "./components/WaitlistModal.js";
import { testConnection } from "./config/supabase.js";

// Global waitlist modal instance
let waitlistModal = null;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize waitlist modal
  initializeWaitlist();

  // Prevent zooming on desktop and mobile
  preventZooming();

  // Initialize TikTok-style scrolling experience
  initializeTikTokScrolling();

  // Setup TikTok-style scroll indicators
  setupTikTokScrollIndicators();

  // Add smooth scrolling for navigation links
  setupSmoothScrolling();

  // Setup grid scroll protection
  setupGridScrollProtection();

  // Button click handlers for CTA buttons - Updated to show waitlist modal
  setupWaitlistButtons();

  // Enhanced navbar background on scroll - keep consistent dark brown theme
  // ALWAYS keep navbar visible and fixed
  const navbar = document.querySelector(".nav-header");

  // Force navbar to always stay visible
  function ensureNavbarVisible() {
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

  // Call immediately and on scroll
  ensureNavbarVisible();

  // Also ensure navbar stays visible on resize (orientation change, etc.)
  window.addEventListener("resize", ensureNavbarVisible);
  window.addEventListener("orientationchange", ensureNavbarVisible);

  window.addEventListener("scroll", function () {
    // Always ensure navbar stays visible
    ensureNavbarVisible();

    // Update background based on scroll position
    if (window.scrollY > 50) {
      navbar.style.background =
        "linear-gradient(135deg, #2d1b0e 0%, #1f0f08 100%)";
      navbar.style.boxShadow = "0 2px 20px rgba(45, 27, 14, 0.3)";
    } else {
      navbar.style.background =
        "linear-gradient(135deg, #2d1b0e 0%, #1f0f08 100%)";
      navbar.style.boxShadow = "none";
    }
  });

  // Animate statistics on scroll (intersection observer)
  const stats = document.querySelectorAll(".stat-number");
  const observerOptions = {
    threshold: 0.5,
    once: true,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        // Simple animation placeholder
        stat.style.opacity = "0";
        setTimeout(() => {
          stat.style.transition = "opacity 0.6s ease";
          stat.style.opacity = "1";
        }, 100);
      }
    });
  }, observerOptions);

  stats.forEach((stat) => {
    observer.observe(stat);
  });

  // Setup fade-in animations for cards
  setupFadeInAnimations();

  // Setup smooth card interactions with modal
  setupUpdateCardInteractions();

  // Setup modal event listeners
  setupModalEventListeners();

  // Setup mobile hamburger menu
  setupMobileMenu();

  console.log("Logity TikTok-style landing page loaded successfully! 🚀");
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
      threshold: 0.6, // Trigger when 60% of section is visible
      rootMargin: "0px 0px -10% 0px",
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Enhanced keyboard navigation for TikTok-style experience
  document.addEventListener("keydown", function (e) {
    if (isScrolling) return;

    if (e.key === "ArrowDown" && currentSection < sections.length - 1) {
      e.preventDefault();
      scrollToSection(currentSection + 1);
    } else if (e.key === "ArrowUp" && currentSection > 0) {
      e.preventDefault();
      scrollToSection(currentSection - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToSection(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToSection(sections.length - 1);
    }
  });

  // Mouse wheel navigation - desktop only for aggressive snapping
  let wheelTimeout;

  // Only apply aggressive wheel scrolling on desktop (>768px)
  if (window.innerWidth > 768) {
    main.addEventListener("wheel", function (e) {
      // Check if mouse is over a scrollable grid - if so, be less aggressive
      if (window.mouseOverScrollableGrid) {
        // When over a grid, only trigger TikTok scrolling if we're at the edge
        const activeGrid = document.querySelector(
          ".updates-grid:hover, .featured-grid:hover"
        );
        if (activeGrid) {
          const atTop = activeGrid.scrollTop <= 2;
          const atBottom =
            activeGrid.scrollTop + activeGrid.clientHeight >=
            activeGrid.scrollHeight - 2;

          // Only allow TikTok scrolling if at edges
          if (!((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0))) {
            return; // Let the grid handle the scroll naturally
          }
        }
      }

      if (isScrolling) {
        e.preventDefault();
        return;
      }

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(
        () => {
          if (e.deltaY > 0 && currentSection < sections.length - 1) {
            // Scrolling down
            scrollToSection(currentSection + 1);
          } else if (e.deltaY < 0 && currentSection > 0) {
            // Scrolling up
            scrollToSection(currentSection - 1);
          }
        },
        window.mouseOverScrollableGrid ? 150 : 50
      ); // Longer delay when over grid for more natural feel
    });
  }

  // For mobile/tablet, rely on CSS scroll-snap and touch gestures only

  // Enhanced TikTok-style touch navigation with smart scrollable area detection
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  let isTouchScrolling = false;
  let touchStartElement = null;

  // Only apply TikTok touch behavior on touch devices
  if ("ontouchstart" in window) {
    main.addEventListener(
      "touchstart",
      function (e) {
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
        isTouchScrolling = false;
        touchStartElement = e.target;
      },
      { passive: true }
    );

    main.addEventListener(
      "touchmove",
      function (e) {
        // Check if touch is within a scrollable area
        const scrollableArea = findScrollableParent(touchStartElement);

        if (scrollableArea) {
          // Allow normal scrolling within scrollable areas
          isTouchScrolling = true;
          return;
        }

        // Prevent default scrolling for TikTok-style navigation
        if (!isTouchScrolling) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    main.addEventListener(
      "touchend",
      function (e) {
        if (isScrolling) return;

        touchEndY = e.changedTouches[0].screenY;
        const touchDiff = touchStartY - touchEndY;
        const touchDuration = Date.now() - touchStartTime;

        // Check if touch started in a scrollable area
        const scrollableArea = findScrollableParent(touchStartElement);

        if (scrollableArea && !isTouchScrolling) {
          // Check if we're at the edge of the scrollable area
          const atTop = scrollableArea.scrollTop <= 5;
          const atBottom =
            scrollableArea.scrollTop + scrollableArea.clientHeight >=
            scrollableArea.scrollHeight - 5;

          // Only allow TikTok navigation if at edges and swipe is significant
          if (Math.abs(touchDiff) > 50 && touchDuration < 800) {
            if (
              (touchDiff > 0 &&
                atBottom &&
                currentSection < sections.length - 1) ||
              (touchDiff < 0 && atTop && currentSection > 0)
            ) {
              e.preventDefault();

              if (touchDiff > 0) {
                scrollToSection(currentSection + 1);
              } else {
                scrollToSection(currentSection - 1);
              }
            }
          }
          return;
        }

        // TikTok-style navigation for non-scrollable areas
        if (
          !isTouchScrolling &&
          Math.abs(touchDiff) > 30 &&
          touchDuration < 800
        ) {
          e.preventDefault();

          if (touchDiff > 0 && currentSection < sections.length - 1) {
            // Swiped up - go to next section
            scrollToSection(currentSection + 1);
          } else if (touchDiff < 0 && currentSection > 0) {
            // Swiped down - go to previous section
            scrollToSection(currentSection - 1);
          }
        }

        // Reset touch scrolling flag
        isTouchScrolling = false;
      },
      { passive: false }
    );

    // Disable native scroll momentum on main container only
    main.style.overscrollBehavior = "none";
  }

  // Helper function to find scrollable parent elements
  function findScrollableParent(element) {
    const scrollableSelectors = [
      ".updates-grid",
      ".featured-grid",
      ".modal-container",
      ".mission-section .container",
      ".cta-section .container",
    ];

    let current = element;
    while (current && current !== document.body) {
      // Check if current element matches any scrollable selector
      for (const selector of scrollableSelectors) {
        if (current.matches && current.matches(selector)) {
          // Verify it's actually scrollable
          if (current.scrollHeight > current.clientHeight) {
            return current;
          }
        }
      }
      current = current.parentElement;
    }
    return null;
  }

  function scrollToSection(index) {
    if (index >= 0 && index < sections.length && !isScrolling) {
      isScrolling = true;
      currentSection = index;

      sections[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrolling = false;
      }, 800);

      updateTikTokScrollIndicators(index);
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
        "Pattern recognition in CAN bus data",
        "Anomaly detection using neural networks",
        "Automated fault classification",
        "Real-time analysis capabilities",
        "Custom model training for specific use cases",
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

  // Global flag to track if mouse is over a scrollable grid
  window.mouseOverScrollableGrid = false;

  function setupGridProtection(grid) {
    if (!grid) return;

    // Mouse enter - mark as over scrollable grid
    grid.addEventListener("mouseenter", function () {
      window.mouseOverScrollableGrid = true;
      grid.classList.add("scroll-focus");
      console.log("Mouse over grid - TikTok scrolling will be less aggressive");
    });

    // Mouse leave - mark as not over scrollable grid
    grid.addEventListener("mouseleave", function () {
      window.mouseOverScrollableGrid = false;
      grid.classList.remove("scroll-focus");
      console.log("Mouse left grid - TikTok scrolling restored");
    });
  }

  // Setup protection for both grids
  setupGridProtection(updatesGrid);
  setupGridProtection(featuredGrid);

  console.log("Grid scroll protection enabled");
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

  // Close menu when clicking on a link
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
      // Small delay to allow menu to close before scrolling
      setTimeout(() => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          const targetSection = document.querySelector(targetId);
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }, 300);
    });
  });

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
