/**
 * Waitlist Modal Component
 * Location: frontend/web/src/components/WaitlistModal.js
 * Purpose: Modal for waitlist email signup when users click "Try logity" buttons
 */

import { addToWaitlist } from "../services/waitlistService.js";

export class WaitlistModal {
  constructor() {
    this.modalId = "waitlist-modal";
    this.isVisible = false;
    this.currentSource = "unknown";
    this.init();
  }

  /**
   * Initialize the modal and create DOM elements
   */
  init() {
    this.createModal();
    this.attachEventListeners();
  }

  /**
   * Create modal HTML structure and inject into DOM
   */
  createModal() {
    const modalHTML = `
      <div id="${this.modalId}" class="modal-overlay" style="display: none;">
        <div class="modal-container waitlist-modal">
          <div class="modal-header">
            <div class="modal-icon-container">
              <div class="modal-feature-icon">📧</div>
            </div>
            <div class="modal-title-section">
              <h2 class="modal-title">Join the logity Waitlist</h2>
              <div class="modal-category">Be the first to access AI-powered automotive log analysis</div>
            </div>
            <button class="modal-close" id="close-waitlist-modal" aria-label="Close modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-content">
            <div class="waitlist-form">
              <div class="form-group">
                <label for="waitlist-email" class="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="waitlist-email" 
                  class="form-input" 
                  placeholder="Enter your email address"
                  required
                >
                <div id="email-error" class="error-message" style="display: none;"></div>
                <div id="email-success" class="success-message" style="display: none;"></div>
              </div>

              <button id="submit-waitlist" class="btn-primary btn-large waitlist-submit" type="button">
                <span class="button-text">Join Waitlist</span>
                <span class="button-loading" style="display: none;">
                  <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/>
                  </svg>
                  Joining...
                </span>
              </button>

              <p class="waitlist-description">
                Get early access to logity's AI-powered automotive log analysis platform. 
                We'll notify you as soon as it's ready!
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <div class="modal-mascot">
              <img src="./public/logo.png" alt="logity logo" class="modal-mascot-logo" />
              <span class="modal-mascot-text">We'll keep you updated on our progress!</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert modal into DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  /**
   * Attach event listeners to modal elements
   */
  attachEventListeners() {
    // Close modal button
    document
      .getElementById("close-waitlist-modal")
      .addEventListener("click", () => {
        this.hide();
      });

    // Close modal when clicking outside
    document.getElementById(this.modalId).addEventListener("click", (e) => {
      if (e.target.id === this.modalId) {
        this.hide();
      }
    });

    // Submit form
    document.getElementById("submit-waitlist").addEventListener("click", () => {
      this.handleSubmit();
    });

    // Submit on Enter key
    document
      .getElementById("waitlist-email")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleSubmit();
        }
      });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.hide();
      }
    });
  }

  /**
   * Show the modal
   * @param {string} source - Source of the signup (e.g., 'hero-button', 'nav-button')
   */
  show(source = "unknown") {
    this.currentSource = source;
    const modal = document.getElementById(this.modalId);

    // First set display to flex, then add active class (like other modals)
    modal.style.display = "flex";
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);
    this.isVisible = true;

    // Focus on email input
    setTimeout(() => {
      document.getElementById("waitlist-email").focus();
    }, 100);

    // Prevent body scrolling - use centralized method
    if (window.preventBodyScroll) {
      window.preventBodyScroll();
    } else {
      document.body.classList.add("modal-open");
    }
  }

  /**
   * Hide the modal
   */
  hide() {
    const modal = document.getElementById(this.modalId);

    // Remove active class, then hide display (like other modals)
    modal.classList.remove("active");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
    this.isVisible = false;

    // Reset form
    this.resetForm();

    // Restore body scrolling - use centralized method
    if (window.restoreBodyScroll) {
      window.restoreBodyScroll();
    } else {
      document.body.classList.remove("modal-open");
    }
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    document.getElementById("waitlist-email").value = "";
    this.hideError();
    this.hideSuccess();
    this.setLoadingState(false);
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    const email = document.getElementById("waitlist-email").value.trim();

    if (!email) {
      this.showError("Please enter your email address");
      return;
    }

    this.setLoadingState(true);
    this.hideError();
    this.hideSuccess();

    try {
      const result = await addToWaitlist(email, this.currentSource);

      if (result.success) {
        this.showSuccess("🎉 You're on the waitlist! We'll be in touch soon.");
        // Auto-close after 3 seconds
        setTimeout(() => {
          this.hide();
        }, 3000);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Something went wrong. Please try again.");
      console.error("Waitlist submission error:", error);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Set loading state for submit button
   * @param {boolean} isLoading
   */
  setLoadingState(isLoading) {
    const button = document.getElementById("submit-waitlist");
    const buttonText = button.querySelector(".button-text");
    const buttonLoading = button.querySelector(".button-loading");

    if (isLoading) {
      buttonText.style.display = "none";
      buttonLoading.style.display = "flex";
      button.disabled = true;
    } else {
      buttonText.style.display = "block";
      buttonLoading.style.display = "none";
      button.disabled = false;
    }
  }

  /**
   * Show error message
   * @param {string} message
   */
  showError(message) {
    const errorEl = document.getElementById("email-error");
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }

  /**
   * Hide error message
   */
  hideError() {
    document.getElementById("email-error").style.display = "none";
  }

  /**
   * Show success message
   * @param {string} message
   */
  showSuccess(message) {
    const successEl = document.getElementById("email-success");
    successEl.textContent = message;
    successEl.style.display = "block";
  }

  /**
   * Hide success message
   */
  hideSuccess() {
    document.getElementById("email-success").style.display = "none";
  }
}
