(function () {
  "use strict";

  const config = window.SITE_CONFIG;
  if (!config) {
    throw new Error("Site configuration is missing. Check that js/config.js is loaded before js/main.js.");
  }

  document.querySelectorAll("[data-company-name]").forEach((element) => {
    element.textContent = config.companyName;
  });

  const robotsTag = document.querySelector('meta[name="robots"]');
  if (robotsTag && document.body.dataset.page !== "privacy") {
    robotsTag.content = config.allowIndexing ? "index,follow" : "noindex,nofollow";
  }

  const domain = config.websiteDomain.trim();
  if (domain) {
    let canonicalOrigin;
    try {
      const configuredDomain = new URL(domain);
      if (configuredDomain.protocol !== "https:" || configuredDomain.pathname !== "/" ||
          configuredDomain.search || configuredDomain.hash) {
        throw new Error("websiteDomain must be an HTTPS origin with no path, query or fragment.");
      }
      canonicalOrigin = configuredDomain.origin;
    } catch (error) {
      throw new Error(`Invalid websiteDomain in js/config.js: ${error.message}`);
    }
    const canonicalPath = window.location.pathname.replace(/index\.html$/, "");
    const canonicalUrl = new URL(canonicalPath, `${canonicalOrigin}/`).href;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.append(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;
    let openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (!openGraphUrl) {
      openGraphUrl = document.createElement("meta");
      openGraphUrl.setAttribute("property", "og:url");
      document.head.append(openGraphUrl);
    }
    openGraphUrl.content = canonicalUrl;
  }
  let openGraphSiteName = document.querySelector('meta[property="og:site_name"]');
  if (!openGraphSiteName) {
    openGraphSiteName = document.createElement("meta");
    openGraphSiteName.setAttribute("property", "og:site_name");
    document.head.append(openGraphSiteName);
  }
  openGraphSiteName.content = config.companyName;

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === document.body.dataset.page) {
      link.setAttribute("aria-current", "page");
    }
  });

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (menuButton.getAttribute("aria-expanded") === "true" &&
          event.target instanceof Node &&
          !menuButton.contains(event.target) &&
          !navigation.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 761px)").matches) {
        closeMenu();
      }
    });
  }

  const phone = config.phone.trim();
  document.querySelectorAll("[data-phone-display]").forEach((element) => {
    if (phone) {
      const link = document.createElement("a");
      const digits = phone.replace(/\D/g, "");
      link.href = `tel:${phone.trim().startsWith("+") ? `+${digits}` : digits}`;
      link.textContent = phone;
      element.replaceWith(link);
    }
  });

  const email = config.email.trim();
  document.querySelectorAll("[data-email-display]").forEach((element) => {
    if (email) {
      const link = document.createElement("a");
      link.href = `mailto:${email}`;
      link.textContent = email;
      element.replaceWith(link);
    }
  });

  const locations = config.locations.filter((location) => location.trim());
  document.querySelectorAll("[data-locations-display]").forEach((element) => {
    if (locations.length) {
      element.textContent = locations.join(", ");
    }
  });

  document.querySelectorAll("[data-contact-summary]").forEach((element) => {
    const contactValue = email || phone;
    if (contactValue) {
      const link = document.createElement("a");
      const digits = phone.replace(/\D/g, "");
      link.href = email ? `mailto:${email}` :
        `tel:${phone.trim().startsWith("+") ? `+${digits}` : digits}`;
      link.textContent = contactValue;
      element.replaceWith(link);
    }
  });

  document.querySelectorAll("[data-opening-hours]").forEach((element) => {
    if (config.openingHours.trim()) {
      element.textContent = config.openingHours;
    }
  });

  document.querySelectorAll("[data-address-display]").forEach((element) => {
    if (config.address.trim()) {
      element.textContent = config.address;
    } else {
      element.closest(".contact-method")?.remove();
    }
  });

  const socialNames = {
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn"
  };
  document.querySelectorAll(".footer-brand").forEach((brand) => {
    const configuredSocials = Object.entries(socialNames).filter(([key]) => config.social[key]);
    if (!configuredSocials.length) {
      return;
    }
    const socialList = document.createElement("div");
    socialList.className = "footer-social";
    socialList.setAttribute("aria-label", "Social media");
    configuredSocials.forEach(([key, label]) => {
      const link = document.createElement("a");
      let socialUrl;
      try {
        socialUrl = new URL(config.social[key]);
      } catch {
        throw new Error(`Invalid ${key} URL in js/config.js.`);
      }
      if (socialUrl.protocol !== "https:") {
        throw new Error(`${key} URL in js/config.js must use HTTPS.`);
      }
      link.href = socialUrl.href;
      link.textContent = label;
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      socialList.append(link);
    });
    brand.append(socialList);
  });

  const serviceSelect = document.querySelector("#service");
  if (serviceSelect && Array.isArray(config.services)) {
    const selectedService = new URLSearchParams(window.location.search).get("service");
    const approvedServices = new Set(config.services);
    Array.from(serviceSelect.options).forEach((option) => {
      if (option.value && !approvedServices.has(option.value)) {
        option.remove();
      }
    });
    const requestedService = selectedService === "domestic" ? "Domestic cleaning" :
      selectedService === "commercial" ? "Commercial cleaning" : "";
    if (requestedService && approvedServices.has(requestedService)) {
      serviceSelect.value = requestedService;
    }
  }
})();
