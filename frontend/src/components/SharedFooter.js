/**
 * Shared Footer Component for Logity Website
 * This component ensures consistent footer across all pages
 * Location: frontend/src/components/SharedFooter.js
 */

export class SharedFooter {
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
   * Generate the footer HTML
   */
  getFooterHTML() {
    return `
      <!-- CTA Section with Footer -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <!-- Mascot above the text -->
            <div class="cta-mascot">
              <img
                src="/logo-contact-sales-no-background.png"
                alt="logity contact sales"
                class="contact-sales-logo"
              />
            </div>
            <h2 class="cta-title">
              Ready to start analyzing your automotive logs?
            </h2>
            <!-- Both buttons below the text -->
            <div class="cta-actions">
              <button class="btn-primary btn-large">Try Logity</button>
              <button
                class="btn-contact-sales-pricing"
                id="contact-sales-pricing-btn"
              >
                Contact Sales
              </button>
            </div>
          </div>

          <!-- Footer content within CTA section -->
          <div class="footer-content">
            <div class="footer-main">
              <div class="footer-section">
                <h4 class="footer-title">Product</h4>
                <ul class="footer-links">
                  <li><a href="overview.html">Logity overview</a></li>
                  <li><a href="#" class="disabled">Desktop app</a></li>
                  <li><a href="#" class="disabled">Web platform</a></li>
                  <li><a href="#" class="disabled">Enterprise</a></li>
                  <li><a href="${this.getLinkHref("pricing")}">Pricing</a></li>
                  <li><a href="#" class="disabled">Download apps</a></li>
                </ul>
              </div>

              <div class="footer-section">
                <h4 class="footer-title">API Platform</h4>
                <ul class="footer-links">
                  <li><a href="#" class="disabled">API overview</a></li>
                  <li><a href="#" class="disabled">Developer docs</a></li>
                  <li><a href="#" class="disabled">Pricing</a></li>
                  <li><a href="#" class="disabled">Console login</a></li>
                </ul>
              </div>

              <div class="footer-section">
                <h4 class="footer-title">Solutions</h4>
                <ul class="footer-links">
                  <li><a href="#" class="disabled">Automotive debugging</a></li>
                  <li><a href="#" class="disabled">Log analysis</a></li>
                  <li><a href="#" class="disabled">Fault detection</a></li>
                </ul>
              </div>

              <div class="footer-section">
                <h4 class="footer-title">Learn</h4>
                <ul class="footer-links">
                  <li><a href="docs.html">Documentation</a></li>
                  <li><a href="#" class="disabled">Customer stories</a></li>
                  <li><a href="#" class="disabled">Engineering blog</a></li>
                </ul>
              </div>

              <div class="footer-section">
                <h4 class="footer-title">Company</h4>
                <ul class="footer-links">
                  <li><a href="about.html">About us</a></li>
                  <li><a href="#" class="disabled">Careers</a></li>
                  <li><a href="#" class="disabled">Events</a></li>
                  <li><a href="#" class="disabled">News</a></li>
                </ul>
              </div>
            </div>

            <div class="footer-bottom">
              <div class="footer-legal">
                <div class="footer-logo">
                  <img src="/logo.svg" alt="logity logo" class="footer-mascot-logo" />
                  <span class="footer-logo-text">logity</span>
                </div>
                <div class="footer-links-inline">
                  <a href="#">Privacy policy</a>
                  <a href="#">Terms of service</a>
                  <a href="#">Security</a>
                </div>
              </div>
              <div class="footer-copyright">
                <p>&copy; 2025 logity. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generate appropriate link href based on current page
   */
  getLinkHref(section) {
    if (this.currentPage === "index") {
      // On homepage, link to sections
      const sectionMap = {
        pricing: "#pricing",
      };
      return sectionMap[section] || "#";
    } else {
      // On other pages, link back to homepage sections
      const sectionMap = {
        pricing: "index.html#pricing",
      };
      return sectionMap[section] || "index.html";
    }
  }

  /**
   * Inject footer into the page
   */
  render() {
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = this.getFooterHTML();
    } else {
      // If no container exists, inject at the end of body
      document.body.insertAdjacentHTML("beforeend", this.getFooterHTML());
    }

    // Setup footer functionality after injection
    this.setupFooterFunctionality();
  }

  /**
   * Setup footer interactive functionality
   */
  setupFooterFunctionality() {
    // Setup CTA button
    const ctaButton = document.querySelector(".cta-section .btn-primary");
    if (ctaButton) {
      ctaButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Trigger waitlist modal if available
        if (window.waitlistModal) {
          window.waitlistModal.show("footer-cta");
        } else {
          console.log("Opening waitlist modal from footer CTA");
          // Fallback behavior
          alert("Please check back soon! We're setting up the waitlist.");
        }
      });
    }

    // Setup Contact Sales button
    const contactSalesButton = document.getElementById(
      "contact-sales-pricing-btn"
    );
    if (contactSalesButton) {
      contactSalesButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Trigger contact sales modal if available
        const contactSalesModal = document.getElementById(
          "contact-sales-modal"
        );
        if (contactSalesModal) {
          contactSalesModal.style.display = "flex";
          setTimeout(() => {
            contactSalesModal.classList.add("active");
          }, 10);
          document.body.style.overflow = "hidden";
        } else {
          console.log("Contact Sales modal not found");
          // Fallback behavior
          window.location.href = "mailto:silvio.dacol@outlook.com";
        }
      });
    }

    // Setup footer navigation links
    const footerNavLinks = document.querySelectorAll(
      '.footer-links a[href^="#"]'
    );
    footerNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (this.currentPage !== "index") {
          // Will navigate to homepage, let it handle naturally
          return;
        }

        // Handle smooth scrolling on homepage
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Setup mobile footer accordion for mobile devices
    if (window.innerWidth <= 768) {
      this.setupMobileFooterAccordion();
    }

    // Handle window resize to toggle footer accordion
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        this.setupMobileFooterAccordion();
      } else {
        this.removeFooterAccordion();
      }
    });

    console.log("✅ Shared footer functionality initialized");
  }

  /**
   * Setup mobile footer accordion functionality
   */
  setupMobileFooterAccordion() {
    // Create overlay element for dimmed background effect
    const createFooterOverlay = () => {
      let overlay = document.querySelector(".footer-accordion-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "footer-accordion-overlay";
        document.body.appendChild(overlay);

        // Add click listener to close accordion when clicking overlay
        overlay.addEventListener("click", (e) => {
          const footerMain = document.querySelector(".footer-main");
          if (footerMain && !footerMain.contains(e.target)) {
            this.closeAllFooterSections();
          }
        });
      }
      return overlay;
    };

    // Function to close all open footer sections
    const closeAllFooterSections = () => {
      const footerSections = document.querySelectorAll(".footer-section");
      const overlay = document.querySelector(".footer-accordion-overlay");

      footerSections.forEach((section) => {
        const title = section.querySelector(".footer-title");
        const content = section.querySelector(".footer-links");

        if (title?.getAttribute("aria-expanded") === "true") {
          section.classList.remove("open");
          title.setAttribute("aria-expanded", "false");
          content.setAttribute("aria-hidden", "true");
          content.style.maxHeight = "0";
          content.style.opacity = "0";
        }
      });

      if (overlay) {
        overlay.classList.remove("active");
      }
      document.body.classList.remove("footer-accordion-open");
    };

    // Make closeAllFooterSections available for this instance
    this.closeAllFooterSections = closeAllFooterSections;

    // Only initialize on mobile screens (768px and below)
    if (window.innerWidth > 768) {
      this.removeFooterAccordion();
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

      // Set initial state (all closed)
      links.style.maxHeight = "0";
      links.style.overflow = "hidden";
      links.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
      links.style.opacity = "0";

      // Click event listener
      title.addEventListener("click", () => {
        this.toggleFooterSection(section, index);
      });

      // Keyboard accessibility
      title.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleFooterSection(section, index);
        }
      });
    });

    // Close accordion when pressing Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAllFooterSections();
      }
    });

    console.log("Mobile footer accordion initialized! 📱");
  }

  /**
   * Toggle footer section in accordion
   */
  toggleFooterSection(clickedSection, clickedIndex) {
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

      if (overlay) {
        overlay.classList.remove("active");
      }
      document.body.classList.remove("footer-accordion-open");
    } else {
      // Open the clicked section
      clickedSection.classList.add("open");
      clickedTitle.setAttribute("aria-expanded", "true");
      clickedContent.setAttribute("aria-hidden", "false");

      const scrollHeight = clickedContent.scrollHeight;
      clickedContent.style.maxHeight = scrollHeight + "px";
      clickedContent.style.opacity = "1";

      if (overlay) {
        overlay.classList.add("active");
      }
      document.body.classList.add("footer-accordion-open");
    }
  }

  /**
   * Remove footer accordion functionality
   */
  removeFooterAccordion() {
    const footerSections = document.querySelectorAll(".footer-section");
    const overlay = document.querySelector(".footer-accordion-overlay");

    // Remove overlay
    if (overlay) {
      overlay.remove();
    }

    footerSections.forEach((section) => {
      const title = section.querySelector(".footer-title");
      const links = section.querySelector(".footer-links");

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
    });
  }
}
