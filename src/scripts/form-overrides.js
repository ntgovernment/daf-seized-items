/**
 * Form Elements Overrides
 * Provides enhanced functionality and styling for form elements
 */

(function () {
  "use strict";

  // Initialize form enhancements when DOM is ready
  function initFormEnhancements() {
    enhanceFormElements();
    addFormValidationListeners();
    enhanceSelectElements();
    enhanceFileInputs();
    removeExternalClassFromFormAnchors();
    manageMetadataWarnings();
  }

  /**
   * Enhance all form elements with accessibility and styling
   */
  function enhanceFormElements() {
    // Get all form inputs
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], input[type="url"], input[type="search"], textarea, select',
    );

    inputs.forEach(function (input) {
      // Add data attributes for tracking
      if (!input.getAttribute("data-enhanced")) {
        input.setAttribute("data-enhanced", "true");

        // Add placeholder text if missing
        if (!input.placeholder && input.getAttribute("aria-label")) {
          input.placeholder = input.getAttribute("aria-label");
        }

        // Add ARIA attributes for accessibility
        if (!input.getAttribute("aria-describedby") && input.parentElement) {
          const errorMsg = input.parentElement.querySelector(
            ".error-message, .form-error-message, .invalid-feedback",
          );
          if (errorMsg) {
            errorMsg.id = errorMsg.id || input.id + "-error";
            input.setAttribute("aria-describedby", errorMsg.id);
          }
        }
      }
    });
  }

  /**
   * Add validation event listeners to form inputs
   */
  function addFormValidationListeners() {
    const inputs = document.querySelectorAll("input, textarea, select");

    inputs.forEach(function (input) {
      // Validate on blur
      input.addEventListener("blur", function () {
        validateFormElement(this);
      });

      // Clear error on input
      input.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          this.classList.remove("is-invalid");
          this.classList.remove("form-error");
          this.removeAttribute("aria-invalid");
        }
      });

      // Handle focus styling
      input.addEventListener("focus", function () {
        this.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        this.classList.remove("focused");
      });
    });
  }

  /**
   * Validate a single form element
   * @param {HTMLElement} element - The form element to validate
   */
  function validateFormElement(element) {
    let isValid = true;
    let errorMessage = "";

    if (element.hasAttribute("required") && !element.value.trim()) {
      isValid = false;
      errorMessage = "This field is required";
    } else if (element.type === "email" && element.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(element.value);
      if (!isValid) errorMessage = "Please enter a valid email address";
    } else if (element.type === "tel" && element.value) {
      const telRegex = /^[\d\s\-\+\(\)]+$/;
      isValid = telRegex.test(element.value);
      if (!isValid) errorMessage = "Please enter a valid phone number";
    } else if (element.type === "url" && element.value) {
      try {
        new URL(element.value);
      } catch {
        isValid = false;
        errorMessage = "Please enter a valid URL";
      }
    } else if (element.hasAttribute("pattern") && element.value) {
      const pattern = new RegExp(element.getAttribute("pattern"));
      isValid = pattern.test(element.value);
      if (!isValid)
        errorMessage =
          element.getAttribute("title") || "Please match the required format";
    }

    // Update element state
    if (isValid) {
      element.classList.remove("is-invalid");
      element.classList.remove("form-error");
      element.classList.remove("error");
      element.classList.add("is-valid");
      element.setAttribute("aria-invalid", "false");
      removeErrorMessage(element);
    } else {
      element.classList.add("is-invalid");
      element.classList.add("form-error");
      element.classList.add("error");
      element.classList.remove("is-valid");
      element.setAttribute("aria-invalid", "true");
      showErrorMessage(element, errorMessage);
    }

    return isValid;
  }

  /**
   * Show error message below a form element - Figma Design
   * @param {HTMLElement} element - The form element
   * @param {string} message - The error message to display
   */
  function showErrorMessage(element, message) {
    // Remove any existing error message
    removeErrorMessage(element);

    // Create error message element
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.setAttribute("role", "alert");
    errorDiv.setAttribute("aria-live", "polite");
    errorDiv.textContent = message;

    // Find the appropriate container to insert the error message
    const wrapper =
      element.closest(".sq-metadata-contents-wrapper") ||
      element.closest(".sq-limbo-field") ||
      element.parentElement;

    if (wrapper) {
      // Insert after the input element
      const insertAfter = element.nextElementSibling || element;
      if (insertAfter.nextSibling) {
        wrapper.insertBefore(errorDiv, insertAfter.nextSibling);
      } else {
        wrapper.appendChild(errorDiv);
      }
    }

    // Set aria-describedby for accessibility
    const errorId = "error-" + element.id || "error-" + Date.now();
    errorDiv.id = errorId;
    element.setAttribute("aria-describedby", errorId);
  }

  /**
   * Remove error message from a form element
   * @param {HTMLElement} element - The form element
   */
  function removeErrorMessage(element) {
    const wrapper =
      element.closest(".sq-metadata-contents-wrapper") ||
      element.closest(".sq-limbo-field") ||
      element.parentElement;

    if (wrapper) {
      const existingError = wrapper.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }
    }

    // Remove aria-describedby
    element.removeAttribute("aria-describedby");
  }

  /**
   * Enhance select elements with custom styling support
   */
  /**
   * Auto-adjust select width based on longest option
   */
  function autoAdjustSelectWidth(select) {
    // Create temporary element to measure text width
    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "nowrap";

    // Copy computed styles from select to ensure accurate measurement
    const computedStyle = window.getComputedStyle(select);
    tempSpan.style.fontFamily = computedStyle.fontFamily;
    tempSpan.style.fontSize = computedStyle.fontSize;
    tempSpan.style.fontWeight = computedStyle.fontWeight;
    tempSpan.style.letterSpacing = computedStyle.letterSpacing;

    document.body.appendChild(tempSpan);

    let maxWidth = 0;

    // Measure each option
    Array.from(select.options).forEach(function (option) {
      tempSpan.textContent = option.text;
      const width = tempSpan.offsetWidth;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });

    document.body.removeChild(tempSpan);

    // Add padding: left (16px) + right (16px) + chevron space (48px) + buffer (8px)
    const totalPadding = 16 + 16 + 48 + 8;
    const finalWidth = maxWidth + totalPadding;

    // Only apply if not in a date picker context (those use flex with auto width)
    const isInDatePicker = select.closest(".sq-inline-fields-wrapper");
    if (!isInDatePicker) {
      select.style.width = finalWidth + "px";
    } else {
      // For date pickers, set min-width instead
      select.style.minWidth = finalWidth + "px";
    }
  }

  function enhanceSelectElements() {
    const selects = document.querySelectorAll("select");

    selects.forEach(function (select) {
      if (!select.classList.contains("select-enhanced")) {
        select.classList.add("select-enhanced");

        // Add change event listener
        select.addEventListener("change", function () {
          // Trigger validation if required
          if (this.hasAttribute("required") && this.value) {
            validateFormElement(this);
          }

          // Dispatch custom event for form change
          const event = new Event("selectChange", { bubbles: true });
          this.dispatchEvent(event);
        });
      }

      // Always auto-adjust width, even when class already exists
      autoAdjustSelectWidth(select);
    });

    // Re-apply after select2/Matrix scripts have initialized options and styles
    window.setTimeout(function () {
      document.querySelectorAll("select").forEach(autoAdjustSelectWidth);
    }, 0);
    window.setTimeout(function () {
      document.querySelectorAll("select").forEach(autoAdjustSelectWidth);
    }, 150);
  }

  /**
   * Enhance file input elements
   */
  function enhanceFileInputs() {
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(function (fileInput) {
      if (!fileInput.classList.contains("file-enhanced")) {
        fileInput.classList.add("file-enhanced");

        // Add drag and drop support
        const parent = fileInput.parentElement;

        if (parent) {
          // Create drop zone if it doesn't exist
          let dropZone = parent.querySelector(".drop-zone");
          if (!dropZone) {
            dropZone = document.createElement("div");
            dropZone.className = "drop-zone";
            parent.insertBefore(dropZone, fileInput);
          }

          // Drag and drop events
          ["dragenter", "dragover", "dragleave", "drop"].forEach(
            (eventName) => {
              dropZone.addEventListener(eventName, preventDefaults, false);
            },
          );

          function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
          }

          ["dragenter", "dragover"].forEach((eventName) => {
            dropZone.addEventListener(eventName, highlight, false);
          });

          ["dragleave", "drop"].forEach((eventName) => {
            dropZone.addEventListener(eventName, unhighlight, false);
          });

          function highlight(e) {
            dropZone.classList.add("highlight");
          }

          function unhighlight(e) {
            dropZone.classList.remove("highlight");
          }

          // Handle dropped files
          dropZone.addEventListener("drop", handleDrop, false);

          function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            fileInput.files = files;

            // Trigger change event
            const event = new Event("change", { bubbles: true });
            fileInput.dispatchEvent(event);
          }

          // Allow clicking drop zone to select files
          dropZone.addEventListener("click", function () {
            fileInput.click();
          });
        }

        // Update file list display
        fileInput.addEventListener("change", function () {
          const fileList = parent.querySelector(".file-list");
          if (fileList && this.files.length > 0) {
            fileList.innerHTML = "";
            Array.from(this.files).forEach((file) => {
              const item = document.createElement("div");
              item.className = "file-item";
              item.textContent = `${file.name} (${formatFileSize(file.size)})`;
              fileList.appendChild(item);
            });
          }
        });
      }
    });
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  /**
   * Remove external class from form anchor elements
   * These anchors are used as section/field navigation points, not external links
   */
  function removeExternalClassFromFormAnchors() {
    // Remove external class from all anchor elements with name attribute inside forms
    const formAnchors = document.querySelectorAll(
      "form a[name].external, .sq-backend-section-table a.external, .sq-limbo-field a.external",
    );

    formAnchors.forEach(function (anchor) {
      anchor.classList.remove("external");
    });

    // Also check for any anchors with specific names that are commonly used as form anchors
    const namedAnchors = document.querySelectorAll(
      'a[name^="section_"].external, a[name^="field_"].external',
    );

    namedAnchors.forEach(function (anchor) {
      anchor.classList.remove("external");
    });
  }

  /**
   * Manage visibility of metadata warnings based on field values
   */
  function manageMetadataWarnings() {
    // Find all fields with metadata warnings
    const fields = document.querySelectorAll(
      ".sq-backend-data input, .sq-backend-data select, .sq-backend-data textarea",
    );

    fields.forEach(function (field) {
      // Check and update warning visibility on load
      updateWarningVisibility(field);

      // Monitor native DOM changes
      field.addEventListener("change", function () {
        updateWarningVisibility(this);
      });

      // Monitor input (for text fields)
      field.addEventListener("input", function () {
        updateWarningVisibility(this);
      });
    });

    // Also bind via jQuery if available (select2 triggers jQuery events, not native DOM events)
    if (typeof jQuery !== "undefined") {
      jQuery(".sq-backend-data select").on("change select2:select", function () {
        updateWarningVisibility(this);
      });
    }
  }

  /**
   * Show or hide metadata warning based on field value
   * @param {HTMLElement} field - The field element
   */
  function updateWarningVisibility(field) {
    // Find the parent container
    const backendData = field.closest(".sq-backend-data");
    if (!backendData) return;

    const limboField = backendData.previousElementSibling;
    if (!limboField || !limboField.classList.contains("sq-limbo-field")) return;

    // Find the metadata warning
    const warning = limboField.querySelector(".sq-metadata-warning");
    if (!warning) return;

    // Check if field has a value
    let hasValue = false;

    if (field.tagName === "SELECT") {
      hasValue =
        field.value && field.value.trim() !== "" && field.value !== "--";
    } else if (field.type === "hidden") {
      // Skip hidden fields
      return;
    } else {
      hasValue = field.value && field.value.trim() !== "";
    }

    // Hide or show warning using class toggle (CSS !important on .sq-warning-hidden overrides base styles)
    if (hasValue) {
      warning.classList.add("sq-warning-hidden");
    } else {
      warning.classList.remove("sq-warning-hidden");
    }
  }

  /**
   * Validate entire form
   * @param {HTMLFormElement} form - The form to validate
   * @returns {boolean} Whether the form is valid
   */
  window.validateForm = function (form) {
    if (!form) {
      form = document.querySelector("form");
    }

    let isFormValid = true;
    const inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach(function (input) {
      if (!validateFormElement(input)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  };

  /**
   * Reset all form elements to their initial state
   */
  window.resetFormEnhancements = function (form) {
    if (!form) {
      form = document.querySelector("form");
    }

    const inputs = form.querySelectorAll("input, textarea, select");

    inputs.forEach(function (input) {
      input.classList.remove("is-invalid", "is-valid", "form-error", "focused");
      input.removeAttribute("aria-invalid");
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFormEnhancements);
  } else {
    initFormEnhancements();
  }

  // Re-run enhancements on dynamically added content
  const observer = new MutationObserver(function () {
    enhanceFormElements();
    removeExternalClassFromFormAnchors();
    manageMetadataWarnings();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["type", "class"],
  });
})();
