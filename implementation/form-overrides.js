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
    manageTypeOtherFieldVisibility();
    bindCollectByFromSeizedDate();
    enhanceSubmitButtons();
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
   * Enhance file input elements with drag-and-drop upload UI
   */
  function enhanceFileInputs() {
    var fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(function (fileInput) {
      // Skip if already enhanced with the new UI (check for wrapper, not just class)
      if (fileInput.closest(".file-upload")) return;
      fileInput.classList.add("file-enhanced");

      var container =
        fileInput.closest(".sq-form-upload-wrapper") ||
        fileInput.closest(".sq-form-upload") ||
        fileInput.parentElement;
      if (!container) return;

      // Direct parent for DOM insertion
      var parent = fileInput.parentElement;

      // Parse constraints from accept attribute and smallprint
      var acceptAttr = fileInput.getAttribute("accept") || "";
      var acceptedFormats = parseAcceptFormats(acceptAttr);
      var maxFileSize = parseMaxFileSize(container);

      // Determine label text from associated label or parent fieldset
      var labelText = getFileInputLabel(fileInput);
      var isRequired = fileInput.hasAttribute("required");

      // Build enhanced UI
      var wrapper = document.createElement("div");
      wrapper.className = "file-upload";

      // Label section
      var labelSection = document.createElement("div");
      labelSection.className = "file-upload__label";

      var labelRow = document.createElement("div");
      labelRow.className = "file-upload__label-row";

      var labelTextEl = document.createElement("span");
      labelTextEl.className = "file-upload__label-text";
      labelTextEl.textContent = labelText;
      labelRow.appendChild(labelTextEl);

      if (isRequired) {
        var requiredEl = document.createElement("span");
        requiredEl.className = "file-upload__required";
        requiredEl.textContent = "(Required)";
        labelRow.appendChild(requiredEl);
      }

      labelSection.appendChild(labelRow);

      // Helper text from smallprint
      var smallprint = parent.closest(".sq-backend-data")
        ? parent
            .closest(".sq-backend-data")
            .querySelector(".sq-backend-smallprint")
        : null;
      if (smallprint && smallprint.textContent.trim()) {
        var helperEl = document.createElement("div");
        helperEl.className = "file-upload__helper";
        helperEl.textContent = smallprint.textContent.trim();
        labelSection.appendChild(helperEl);
        smallprint.style.display = "none";
      }

      wrapper.appendChild(labelSection);

      // Dropzone
      var dropzone = document.createElement("div");
      dropzone.className = "file-upload__dropzone";
      dropzone.setAttribute("role", "region");
      dropzone.setAttribute("aria-label", "File upload drop zone");

      // Upload icon
      var iconEl = document.createElement("div");
      iconEl.className = "file-upload__dropzone-icon";
      iconEl.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 20" aria-hidden="true"><path d="M0 18h18v2H0v-2zm9-2L3 10h4V0h4v10h4l-6 6z" transform="rotate(180 9 10)"/></svg>';
      dropzone.appendChild(iconEl);

      // Instructional text
      var textContainer = document.createElement("div");
      textContainer.style.cssText =
        "flex-direction:column;justify-content:flex-start;align-items:center;gap:8px;display:flex";

      var dropText = document.createElement("div");
      dropText.className = "file-upload__dropzone-text";
      dropText.textContent = "Drag and drop files or select files to upload";
      textContainer.appendChild(dropText);

      // Meta info (formats + size)
      var metaEl = document.createElement("div");
      metaEl.className = "file-upload__dropzone-meta";

      if (acceptedFormats.length > 0) {
        var formatsSpan = document.createElement("span");
        formatsSpan.textContent =
          "Supported file formats: " + acceptedFormats.join(", ");
        metaEl.appendChild(formatsSpan);
      }

      if (maxFileSize > 0) {
        var sizeSpan = document.createElement("span");
        sizeSpan.textContent =
          "Max file size is " + formatFileSize(maxFileSize);
        metaEl.appendChild(sizeSpan);
      }

      textContainer.appendChild(metaEl);
      dropzone.appendChild(textContainer);

      // Select files button
      var selectBtn = document.createElement("button");
      selectBtn.type = "button";
      selectBtn.className = "file-upload__dropzone-button";
      selectBtn.textContent = "Select files";
      selectBtn.addEventListener("click", function () {
        fileInput.click();
      });
      dropzone.appendChild(selectBtn);

      wrapper.appendChild(dropzone);

      // File list
      var fileList = document.createElement("div");
      fileList.className = "file-upload__file-list";
      fileList.setAttribute("aria-live", "polite");
      fileList.setAttribute("aria-relevant", "additions removals");
      wrapper.appendChild(fileList);

      // Insert wrapper before the input, then move input inside wrapper
      parent.insertBefore(wrapper, fileInput);
      wrapper.appendChild(fileInput);

      // Remove old drop-zone if it existed
      var oldDropZone = parent.querySelector(".drop-zone");
      if (oldDropZone) oldDropZone.remove();

      // Drag and drop events on the dropzone
      ["dragenter", "dragover", "dragleave", "drop"].forEach(
        function (eventName) {
          dropzone.addEventListener(
            eventName,
            function (e) {
              e.preventDefault();
              e.stopPropagation();
            },
            false,
          );
        },
      );

      ["dragenter", "dragover"].forEach(function (eventName) {
        dropzone.addEventListener(
          eventName,
          function () {
            dropzone.classList.add("highlight");
          },
          false,
        );
      });

      ["dragleave", "drop"].forEach(function (eventName) {
        dropzone.addEventListener(
          eventName,
          function () {
            dropzone.classList.remove("highlight");
          },
          false,
        );
      });

      // Handle dropped files
      dropzone.addEventListener(
        "drop",
        function (e) {
          var files = e.dataTransfer.files;
          handleFiles(fileInput, files, fileList, acceptAttr, maxFileSize);
        },
        false,
      );

      // Handle file selection via native picker
      fileInput.addEventListener("change", function () {
        handleFiles(
          fileInput,
          fileInput.files,
          fileList,
          acceptAttr,
          maxFileSize,
        );
      });

      // Allow clicking the dropzone (not the button) to also open picker
      dropzone.addEventListener("click", function (e) {
        if (e.target === selectBtn || selectBtn.contains(e.target)) return;
        fileInput.click();
      });
    });
  }

  /**
   * Handle selected/dropped files — validate and render file list
   */
  function handleFiles(fileInput, files, fileListEl, acceptAttr, maxFileSize) {
    fileListEl.innerHTML = "";
    var hasError = false;

    Array.from(files).forEach(function (file) {
      var validation = validateFile(file, acceptAttr, maxFileSize);
      var state = validation.valid ? "success" : "error";
      if (!validation.valid) hasError = true;

      var item = document.createElement("div");
      item.className = "file-upload__file-item";
      item.setAttribute("data-state", state);

      var row = document.createElement("div");
      row.className = "file-upload__file-item-row";

      var info = document.createElement("div");
      info.className = "file-upload__file-item-info";

      // Status icon
      var statusIcon = document.createElement("div");
      statusIcon.className = "file-upload__file-status-icon";
      if (state === "success") {
        statusIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.67 11.13L3.53 8l-1.07 1.06 4.2 4.2 9.01-9-1.07-1.07-7.93 7.94z"/></svg>';
      } else if (state === "error") {
        statusIcon.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4v5M8 11v1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>';
      }
      info.appendChild(statusIcon);

      // File name
      var nameEl = document.createElement("span");
      nameEl.className = "file-upload__file-name";
      nameEl.textContent = file.name;
      info.appendChild(nameEl);

      row.appendChild(info);

      // Remove button
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "file-upload__file-remove";
      removeBtn.setAttribute("aria-label", "Remove " + file.name);
      removeBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.47 3.53L8 8l4.47 4.47-1.06 1.06L7 9.06l-4.47 4.47-1.06-1.06L5.94 8 1.47 3.53l1.06-1.06L7 6.94l4.47-4.47 1.06 1.06z"/></svg>';
      removeBtn.addEventListener("click", function () {
        item.remove();
        // Clear the file input if no items remain
        if (fileListEl.children.length === 0) {
          clearFileInput(fileInput);
        }
      });
      row.appendChild(removeBtn);

      item.appendChild(row);

      // Error message
      if (!validation.valid) {
        var errorEl = document.createElement("div");
        errorEl.className = "file-upload__file-error";
        errorEl.textContent = validation.message;
        item.appendChild(errorEl);
      }

      fileListEl.appendChild(item);
    });

    // Set aria-invalid on the input
    if (hasError) {
      fileInput.setAttribute("aria-invalid", "true");
    } else {
      fileInput.removeAttribute("aria-invalid");
    }
  }

  /**
   * Validate a single file against accept types and max size
   */
  function validateFile(file, acceptAttr, maxFileSize) {
    // Check file type
    if (acceptAttr) {
      var accepted = acceptAttr.split(",").map(function (t) {
        return t.trim().toLowerCase();
      });
      var fileType = file.type.toLowerCase();
      var fileExt = "." + file.name.split(".").pop().toLowerCase();

      var typeValid = accepted.some(function (accept) {
        if (accept.startsWith(".")) {
          return fileExt === accept;
        }
        if (accept.endsWith("/*")) {
          return fileType.startsWith(accept.replace("/*", "/"));
        }
        return fileType === accept;
      });

      if (!typeValid) {
        var formats = parseAcceptFormats(acceptAttr);
        return {
          valid: false,
          message:
            "File type not supported. Accepted formats: " + formats.join(", "),
        };
      }
    }

    // Check file size
    if (maxFileSize > 0 && file.size > maxFileSize) {
      return {
        valid: false,
        message: "File must be less than " + formatFileSize(maxFileSize),
      };
    }

    return { valid: true, message: "" };
  }

  /**
   * Parse accept attribute into human-readable format list
   */
  function parseAcceptFormats(acceptAttr) {
    if (!acceptAttr) return [];
    return acceptAttr
      .split(",")
      .map(function (t) {
        t = t.trim().toLowerCase();
        // Extract extension from MIME type (e.g., "image/png" -> "png")
        if (t.startsWith(".")) return t.substring(1);
        var parts = t.split("/");
        if (parts.length === 2) return parts[1].replace("jpeg", "jpg");
        return t;
      })
      .filter(function (v, i, a) {
        return a.indexOf(v) === i;
      }); // deduplicate
  }

  /**
   * Parse max file size from nearby smallprint text
   */
  function parseMaxFileSize(container) {
    var smallprint = container.closest(".sq-backend-data")
      ? container
          .closest(".sq-backend-data")
          .querySelector(".sq-backend-smallprint")
      : null;
    if (!smallprint) return 0;

    var text = smallprint.textContent || "";
    var match = text.match(/([\d.]+)\s*(MB|GB|KB)/i);
    if (!match) return 0;

    var value = parseFloat(match[1]);
    var unit = match[2].toUpperCase();
    if (unit === "KB") return value * 1024;
    if (unit === "MB") return value * 1024 * 1024;
    if (unit === "GB") return value * 1024 * 1024 * 1024;
    return 0;
  }

  /**
   * Get label text for a file input
   */
  function getFileInputLabel(fileInput) {
    // Check for associated <label>
    if (fileInput.id) {
      var label = document.querySelector('label[for="' + fileInput.id + '"]');
      if (label) return label.textContent.trim();
    }
    // Check parent fieldset legend
    var fieldset = fileInput.closest("fieldset");
    if (fieldset) {
      var legend = fieldset.querySelector("legend");
      if (legend) return legend.textContent.trim();
    }
    // Check aria-label
    if (fileInput.getAttribute("aria-label")) {
      return fileInput.getAttribute("aria-label");
    }
    // Default
    return "Upload file";
  }

  /**
   * Clear a file input's value
   */
  function clearFileInput(fileInput) {
    fileInput.value = "";
    // Dispatch change event so form knows files were cleared
    var event = new Event("change", { bubbles: true });
    fileInput.dispatchEvent(event);
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    var k = 1024;
    var sizes = ["Bytes", "KB", "MB", "GB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
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
   * Hide/show "If other, specify" based on Type selection
   */
  function manageTypeOtherFieldVisibility() {
    const typeSelect = document.querySelector(
      'select[name="metadata_field_select_1619102"]',
    );
    const otherInput = document.querySelector(
      'input[name="metadata_field_text_1620443_value"]',
    );

    if (!typeSelect || !otherInput) return;

    const otherBackendData = otherInput.closest(".sq-backend-data");
    if (!otherBackendData || !otherBackendData.parentElement) return;

    const otherRow = otherBackendData.parentElement;

    function applyVisibility() {
      const isOther = (typeSelect.value || "").trim().toLowerCase() === "other";

      if (isOther) {
        otherRow.style.display = "";
        return;
      }

      otherRow.style.display = "none";

      if (otherInput.value !== "") {
        otherInput.value = "";
        otherInput.dispatchEvent(new Event("input", { bubbles: true }));
        otherInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    if (!typeSelect.getAttribute("data-other-visibility-bound")) {
      typeSelect.setAttribute("data-other-visibility-bound", "true");
      typeSelect.addEventListener("change", applyVisibility);
    }

    if (
      typeof jQuery !== "undefined" &&
      !typeSelect.getAttribute("data-other-visibility-select2-bound")
    ) {
      typeSelect.setAttribute("data-other-visibility-select2-bound", "true");
      jQuery(typeSelect).on("change select2:select", applyVisibility);
    }

    applyVisibility();
  }

  /**
   * Auto-set "Collect by" to 60 days after "Date and time seized"
   * whenever "Date and time seized" changes.
   */
  function bindCollectByFromSeizedDate() {
    const seizedDay = document.getElementById(
      "metadata_field_date_1619067_datetimevalue_d",
    );
    const seizedMonth = document.getElementById(
      "metadata_field_date_1619067_datetimevalue_m",
    );
    const seizedYear = document.getElementById(
      "metadata_field_date_1619067_datetimevalue_y",
    );

    const collectDay = document.getElementById(
      "metadata_field_date_1619069_datetimevalue_d",
    );
    const collectMonth = document.getElementById(
      "metadata_field_date_1619069_datetimevalue_m",
    );
    const collectYear = document.getElementById(
      "metadata_field_date_1619069_datetimevalue_y",
    );

    if (
      !seizedDay ||
      !seizedMonth ||
      !seizedYear ||
      !collectDay ||
      !collectMonth ||
      !collectYear
    ) {
      return;
    }

    let isApplyingAutoCollectBy = false;

    function parseValidDate(daySelect, monthSelect, yearSelect) {
      const day = Number(daySelect.value);
      const month = Number(monthSelect.value);
      const year = Number(yearSelect.value);

      if (!day || !month || !year) return null;

      // Use noon to avoid DST boundary issues when adding days.
      const candidate = new Date(year, month - 1, day, 12, 0, 0, 0);
      if (
        candidate.getFullYear() !== year ||
        candidate.getMonth() !== month - 1 ||
        candidate.getDate() !== day
      ) {
        return null;
      }

      return candidate;
    }

    function emitChange(select) {
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function setSelectValue(select, value) {
      const nextValue = String(value);
      if (select.value !== nextValue) {
        select.value = nextValue;
      }
      emitChange(select);
    }

    function applyCollectByFromSeizedDate() {
      const seizedDate = parseValidDate(seizedDay, seizedMonth, seizedYear);
      if (!seizedDate) return;

      const collectByDate = new Date(seizedDate.getTime());
      collectByDate.setDate(collectByDate.getDate() + 60);

      isApplyingAutoCollectBy = true;
      try {
        setSelectValue(collectDay, collectByDate.getDate());
        setSelectValue(collectMonth, collectByDate.getMonth() + 1);
        setSelectValue(collectYear, collectByDate.getFullYear());
      } finally {
        isApplyingAutoCollectBy = false;
      }
    }

    if (!seizedDay.getAttribute("data-collect-by-source-bound")) {
      seizedDay.setAttribute("data-collect-by-source-bound", "true");
      seizedMonth.setAttribute("data-collect-by-source-bound", "true");
      seizedYear.setAttribute("data-collect-by-source-bound", "true");

      seizedDay.addEventListener("change", applyCollectByFromSeizedDate);
      seizedMonth.addEventListener("change", applyCollectByFromSeizedDate);
      seizedYear.addEventListener("change", applyCollectByFromSeizedDate);
    }

    if (
      typeof jQuery !== "undefined" &&
      !seizedDay.getAttribute("data-collect-by-select2-bound")
    ) {
      seizedDay.setAttribute("data-collect-by-select2-bound", "true");
      jQuery(seizedDay).on(
        "change select2:select",
        applyCollectByFromSeizedDate,
      );
      jQuery(seizedMonth).on(
        "change select2:select",
        applyCollectByFromSeizedDate,
      );
      jQuery(seizedYear).on(
        "change select2:select",
        applyCollectByFromSeizedDate,
      );
    }

    applyCollectByFromSeizedDate();
  }

  /**
   * Enhance submit buttons with a loading spinner on click
   */
  function enhanceSubmitButtons() {
    var buttons = document.querySelectorAll(
      '.sq-commit-button, input[type="submit"].sq-btn-green, input[type="button"].sq-btn-green',
    );

    buttons.forEach(function (btn) {
      if (btn.getAttribute("data-submit-enhanced")) return;
      btn.setAttribute("data-submit-enhanced", "true");

      // Wrap button in a positioned container for spinner overlay
      var wrapper = document.createElement("span");
      wrapper.className = "btn-submit-wrapper";
      btn.parentNode.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);

      btn.addEventListener("click", function () {
        // Defer so the existing onclick handler fires first
        setTimeout(function () {
          btn.disabled = true;

          // Inject spinner overlay
          var spinner = document.createElement("span");
          spinner.className = "btn-spinner";
          spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
          wrapper.appendChild(spinner);
        }, 0);
      });
    });
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

  // Re-run enhancements on dynamically added content (childList only to avoid
  // infinite loops from attribute changes)
  let mutationTimer = null;
  const observer = new MutationObserver(function (mutations) {
    const hasNewNodes = mutations.some(function (m) {
      return m.type === "childList" && m.addedNodes.length > 0;
    });
    if (!hasNewNodes) return;

    if (mutationTimer) clearTimeout(mutationTimer);
    mutationTimer = setTimeout(function () {
      enhanceFormElements();
      removeExternalClassFromFormAnchors();
      manageTypeOtherFieldVisibility();
      bindCollectByFromSeizedDate();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
