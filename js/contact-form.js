(function () {
  "use strict";

  const form = document.querySelector("#quote-form");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const config = window.SITE_CONFIG;
  const setupAlert = document.querySelector("#form-setup-alert");
  const submitButton = document.querySelector("#form-submit");
  const generalError = document.querySelector("#form-general-error");
  const status = document.querySelector("#form-status");
  const endpoint = typeof config?.formEndpoint === "string" ? config.formEndpoint.trim() : "";
  let isSubmitting = false;

  const setFieldError = (name, message) => {
    const input = form.elements.namedItem(name);
    const error = document.querySelector(`#${name}-error`);
    if (input instanceof HTMLElement && error) {
      const descriptions = (input.getAttribute("aria-describedby") || "")
        .split(/\s+/)
        .filter((id) => id && id !== error.id);
      if (message) {
        input.setAttribute("aria-invalid", "true");
        descriptions.push(error.id);
      } else {
        input.removeAttribute("aria-describedby");
        input.removeAttribute("aria-invalid");
      }
      if (descriptions.length) {
        input.setAttribute("aria-describedby", descriptions.join(" "));
      }
      error.textContent = message;
    }
  };

  const clearErrors = () => {
    ["name", "email", "service", "message"].forEach((name) => setFieldError(name, ""));
    generalError.textContent = "";
    status.textContent = "";
    status.classList.remove("is-error");
  };

  const validate = () => {
    clearErrors();
    const fields = {
      name: form.elements.namedItem("name"),
      email: form.elements.namedItem("email"),
      service: form.elements.namedItem("service"),
      message: form.elements.namedItem("message"),
      privacy: form.elements.namedItem("privacy_acknowledgement")
    };
    let firstInvalid = null;

    const markInvalid = (name, message) => {
      setFieldError(name, message);
      firstInvalid ||= fields[name];
    };

    if (!(fields.name instanceof HTMLInputElement) || !fields.name.value.trim()) {
      markInvalid("name", "Enter your name.");
    }
    if (!(fields.email instanceof HTMLInputElement) || !fields.email.value.trim()) {
      markInvalid("email", "Enter your email address.");
    } else if (!fields.email.validity.valid) {
      markInvalid("email", "Enter an email address in the correct format.");
    }
    if (!(fields.service instanceof HTMLSelectElement) || !fields.service.value) {
      markInvalid("service", "Choose a cleaning category.");
    }
    if (!(fields.message instanceof HTMLTextAreaElement) || !fields.message.value.trim()) {
      markInvalid("message", "Tell us a little about the cleaning you need.");
    }
    if (!(fields.privacy instanceof HTMLInputElement) || !fields.privacy.checked) {
      generalError.textContent = "Please read the privacy notice and acknowledge how your enquiry details will be used.";
      firstInvalid ||= fields.privacy;
    }

    if (firstInvalid instanceof HTMLElement) {
      firstInvalid.focus();
      return false;
    }
    return true;
  };

  const endpointIsConfigured = () => {
    try {
      const parsed = new URL(endpoint);
      return parsed.protocol === "https:" && parsed.hostname !== "example.com";
    } catch {
      return false;
    }
  };

  if (endpointIsConfigured()) {
    setupAlert.hidden = true;
    submitButton.disabled = false;
  } else {
    setupAlert.hidden = false;
    submitButton.disabled = true;
  }

  form.addEventListener("input", (event) => {
    if (event.target instanceof HTMLElement && event.target.hasAttribute("aria-invalid")) {
      event.target.removeAttribute("aria-invalid");
      const associatedError = event.target.id ? document.querySelector(`#${event.target.id}-error`) : null;
      if (associatedError) {
        associatedError.textContent = "";
      }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    if (!validate()) {
      return;
    }

    if (!endpointIsConfigured()) {
      generalError.textContent = "The form is not connected yet. Please contact the business directly using the details on this page.";
      setupAlert.hidden = false;
      return;
    }

    const honeypot = form.elements.namedItem("_gotcha");
    if (honeypot instanceof HTMLInputElement && honeypot.value) {
      generalError.textContent = "We couldn’t process this enquiry. Please check the details and try again.";
      return;
    }

    submitButton.disabled = true;
    isSubmitting = true;
    submitButton.classList.add("is-loading");
    submitButton.setAttribute("aria-busy", "true");
    submitButton.innerHTML = "Sending enquiry…";
    generalError.textContent = "";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`The enquiry provider returned HTTP ${response.status}.`);
      }
      form.reset();
      status.textContent = "Thank you. Your enquiry was sent successfully. We’ll be in touch using the details you provided.";
      status.classList.remove("is-error");
    } catch (error) {
      console.error("Enquiry submission failed:", error);
      status.textContent = "We couldn’t send your enquiry just now. Your details are still here; please try again or contact the business directly.";
      status.classList.add("is-error");
    } finally {
      window.clearTimeout(timeout);
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      submitButton.removeAttribute("aria-busy");
      submitButton.innerHTML = 'Send enquiry <span aria-hidden="true">↗</span>';
    }
  });
})();
