/**
 * Shared Navbar Component for Logity Website
 * This component ensures consistent navigation across all pages
 * Location: frontend/src/components/SharedNavbar.js
 */

export class SharedNavbar {
  constructor() {
    this.currentPage = this.getCurrentPage();
  }

  /**
   * Get the current page name from the URL
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split("/").pop().split(".")[0];
    return filename || "index";
  }

  /**
   * Generate the navbar HTML
   */
  getNavbarHTML() {
    return `
      <!-- Navigation Header -->
      <nav class="nav-header">
        <div class="container">
          <div class="nav-content">
            <div class="logo">
              <a href="index.html" class="logo-link" aria-label="Go to home">
                <img src="/logo.svg" alt="logity logo" class="logo-image" />
                <span class="logo-text">logity</span>
              </a>
            </div>

            <!-- Desktop Navigation -->
            <div class="nav-links desktop-nav">
              <a href="${this.getLinkHref("features")}" class="nav-link" data-section="1" data-page="index">Features</a>
              <a href="${this.getLinkHref("pricing")}" class="nav-link" data-section="3" data-page="index">Pricing</a>
              <a href="overview.html" class="nav-link ${this.currentPage === "overview" ? "active" : ""}">Overview</a>
              <a href="docs.html" class="nav-link ${this.currentPage === "docs" ? "active" : ""}">Docs</a>
              <button class="btn-primary">Try Logity</button>
            </div>

            <!-- Mobile Hamburger Button -->
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
              <span class="hamburger-line"></span>
            </button>
          </div>

          <!-- Mobile Navigation Menu -->
          <div class="mobile-nav">
            <div class="mobile-nav-content">
              <a href="${this.getLinkHref("features")}" class="mobile-nav-link" data-section="1" data-page="index">Features</a>
              <a href="${this.getLinkHref("pricing")}" class="mobile-nav-link" data-section="3" data-page="index">Pricing</a>
              <a href="overview.html" class="mobile-nav-link ${this.currentPage === "overview" ? "active" : ""}">Overview</a>
              <a href="docs.html" class="mobile-nav-link ${this.currentPage === "docs" ? "active" : ""}">Docs</a>
              <button class="btn-primary mobile-cta">Try Logity</button>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  /**
   * Generate appropriate link href based on current page
   */
  getLinkHref(section) {
    if (this.currentPage === "index") {
      // On homepage, link to sections
      const sectionMap = {
        features: "#featured-updates",
        pricing: "#pricing",
      };
      return sectionMap[section] || "#";
    } else {
      // On other pages, link back to homepage sections
      const sectionMap = {
        features: "index.html#featured-updates",
        pricing: "index.html#pricing",
      };
      return sectionMap[section] || "index.html";
    }
  }

  /**
   * Inject navbar into the page
   */
  render() {
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = this.getNavbarHTML();
    } else {
      // If no container exists, inject at the beginning of body
      document.body.insertAdjacentHTML("afterbegin", this.getNavbarHTML());
    }

    // Setup navbar functionality after injection
    this.setupNavbarFunctionality();
  }

  /**
   * Setup navbar interactive functionality
   */
  setupNavbarFunctionality() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    let isMenuOpen = false;

    if (mobileMenuToggle && mobileNav) {
      mobileMenuToggle.addEventListener("click", () => {
        isMenuOpen = !isMenuOpen;
        mobileMenuToggle.classList.toggle("active", isMenuOpen);
        mobileNav.classList.toggle("active", isMenuOpen);
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
        mobileMenuToggle.setAttribute("aria-expanded", isMenuOpen);
        mobileNav.setAttribute("aria-hidden", !isMenuOpen);
      });
    }

    // Logo click handler
    const logoLink = document.querySelector(".logo-link");
    if (logoLink) {
      logoLink.addEventListener("click", (e) => {
        if (this.currentPage === "index") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

    // Navigation link handlers
    const navLinks = document.querySelectorAll(
      ".nav-link[data-section], .mobile-nav-link[data-section]"
    );
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (this.currentPage !== "index") {
          // Will navigate to homepage, let it handle naturally
          return;
        }

        // Handle smooth scrolling on homepage
        e.preventDefault();
        const sectionId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(sectionId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Close mobile menu if open
        if (link.classList.contains("mobile-nav-link") && isMenuOpen) {
          mobileMenuToggle.click();
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        isMenuOpen &&
        mobileNav &&
        !mobileNav.contains(e.target) &&
        mobileMenuToggle &&
        !mobileMenuToggle.contains(e.target)
      ) {
        mobileMenuToggle.click();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        mobileMenuToggle.click();
      }
    });

    // Close mobile menu on window resize to desktop size
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        mobileMenuToggle.click();
      }
    });

    // Enhanced navbar background on scroll
    window.addEventListener("scroll", () => {
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

    console.log("✅ Shared navbar functionality initialized");
  }
}
