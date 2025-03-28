const initMobileMenu = () => {
  // Add CSS to document head to ensure mobile menu visibility
  const style = document.createElement("style");
  style.textContent = `
    /* Force white text on mobile menu items */
    #mobile-menu-overlay a {
      color: #ffffff !important;
      opacity: 1 !important;
    }
    
    /* Enhanced active indicator */
    #mobile-menu-overlay a[data-mobile-section].active span,
    #mobile-menu-overlay a[data-mobile-section="pocetna"] span {
      background-color: #ffffff !important;
      height: 2px !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    /* Better borders */
    #mobile-menu-overlay a {
      border-color: rgba(255,255,255,0.2) !important;
    }
    
    /* Darker mobile menu background for better contrast */
    #mobile-menu-overlay {
      background-color: #1a1a1a !important;
    }
  `;
  document.head.appendChild(style);

  // Get all mobile menu links
  const mobileLinks = document.querySelectorAll(
    "#mobile-menu-overlay a[data-mobile-section]",
  );

  // Function to update the active section in mobile menu
  const updateMobileMenu = () => {
    // Get the current section ID from window.activeSection
    const currentSection = window.activeSection || "pocetna";

    // Update all mobile links
    mobileLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-mobile-section");

      // If this link matches the current section
      if (linkSection === currentSection) {
        // Bold this link
        link.style.fontWeight = "bold";

        // Add underline if it doesn't exist
        if (!link.querySelector("span")) {
          const indicator = document.createElement("span");
          indicator.className =
            "absolute bottom-0 left-1/2 mb-0 h-1 w-16 -translate-x-1/2 transform";
          indicator.style.backgroundColor = "white";
          indicator.style.height = "2px";
          link.appendChild(indicator);
        }
      } else {
        // Normal weight for non-active links
        link.style.fontWeight = "normal";

        // Remove underline from non-active links
        const indicator = link.querySelector("span");
        if (indicator) {
          indicator.remove();
        }
      }
    });
  };

  // Initial update
  updateMobileMenu();
};

const initServicesCarousel = () => {
  const slides = document.querySelectorAll(".carousel-slide");
  const nextButton = document.querySelector(".carousel-next");
  const prevButton = document.querySelector(".carousel-prev");
  const dots = document.querySelectorAll(".carousel-dots button");

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  const updateSlides = () => {
    // Hide all slides
    slides.forEach((slide) => {
      slide.style.display = "none";
      slide.style.opacity = 0;
    });

    // Show current slide
    slides[currentIndex].style.display = "block";
    setTimeout(() => {
      slides[currentIndex].style.opacity = 1;
    }, 10);

    // Update dots
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("active", "bg-primary-500", "opacity-90");
        dot.classList.remove("bg-white", "opacity-50");
      } else {
        dot.classList.remove("active", "bg-primary-500", "opacity-90");
        dot.classList.add("bg-white", "opacity-50");
      }
    });
  };

  updateSlides();

  const goToSlide = (index) => {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    currentIndex = index;
    updateSlides();
  };

  nextButton.addEventListener("click", () => {
    goToSlide(currentIndex + 1);
  });

  prevButton.addEventListener("click", () => {
    goToSlide(currentIndex - 1);
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
    });
  });

  const container = document.querySelector(".carousel-container");

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      goToSlide(currentIndex + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      goToSlide(currentIndex - 1);
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      goToSlide(currentIndex + 1);
    }
  });

  // Autoplay functionality
  let autoplayInterval;

  const startAutoplay = () => {
    // Clear any existing interval first
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }

    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); // 5 seconds
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  };

  // Start autoplay immediately
  startAutoplay();

  // Pause autoplay on mouse hover or touch
  const carousel = document.querySelector(".services-carousel");
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("touchstart", stopAutoplay);
  carousel.addEventListener("touchend", () => {
    setTimeout(startAutoplay, 500);
  });
};

const initDetailsCarousel = () => {
  const jobDetails = [
    {
      title: "Naknada Štete na Vozilima",
      description:
        "Kompletan postupak naknade štete od osiguravajućih društava u Srbiji i inostranstvu, kao i od fizičkih lica u slučaju kada nisu osigurani.",
      additionalInfo: "Brza i efikasna procena sa maksimalnom naknadom.",
      image: "/img/v303_461.png",
      imageAlt: "Oštećeno vozilo",
    },
    {
      title: "Nematerjalna Šteta",
      description:
        "Stručna naknada nematerjalne štete za povrede nastale u saobraćajnim nezgodama, po polisi životnog osiguranja ili povrede na radu.",
      additionalInfo: "Maksimalno ostvarivanje vaših prava na naknadu.",
      image: "/img/v303_461.png",
      imageAlt: "Zastupanje klijenata",
    },
    {
      title: "Servis i Transport",
      description:
        "Vršimo procenu i popravku vozila u našem servisu, kao i transport (šlep) vozila koja nisu u voznom stanju po celoj Srbiji.",
      additionalInfo: "Dostupne usluge rente vozila tokom popravke.",
      image: "/img/v303_461.png",
      imageAlt: "Transport vozila",
    },
    {
      title: "Osiguranje i Otkup",
      description:
        "Posredujemo u osiguranju vozila sa kasko polisom kod svih osiguravača, kao i otkup vozila koja nisu u voznom stanju.",
      additionalInfo: "Stručni saveti za najbolju zaštitu.",
      image: "/img/v303_461.png",
      imageAlt: "Osiguranje vozila",
    },
  ];

  let activeIndex = 0;

  const serviceButtons = document.querySelectorAll(".service-button");
  const serviceTitle = document.getElementById("service-title");
  const serviceDescription = document.getElementById("service-description");
  const serviceAdditionalInfo = document.getElementById(
    "service-additional-info",
  );
  const serviceImage = document.getElementById("service-image");
  const nextButton = document.getElementById("next-service-btn");

  const updateContent = () => {
    const activeService = jobDetails[activeIndex];

    serviceTitle.textContent = activeService.title;
    serviceDescription.textContent = activeService.description;
    serviceAdditionalInfo.textContent = activeService.additionalInfo;

    serviceImage.src = activeService.image;
    serviceImage.alt = activeService.imageAlt;

    serviceButtons.forEach((button, index) => {
      const buttonDiv = button.querySelector("div > div:first-child");
      const highlightDiv = button.querySelector("div > div.absolute");

      if (index === activeIndex) {
        button.classList.add("transform", "scale-110");
        button.classList.remove("opacity-70");
        buttonDiv.classList.add("ring-2", "ring-primary-300");

        if (!highlightDiv) {
          const div = document.createElement("div");
          div.className =
            "absolute -inset-3 border border-primary-300 rounded-full opacity-20";
          button.querySelector("div").appendChild(div);
        }
      } else {
        button.classList.remove("transform", "scale-110");
        button.classList.add("opacity-70");
        buttonDiv.classList.remove("ring-2", "ring-primary-300");

        if (highlightDiv) {
          highlightDiv.remove();
        }
      }
    });
  };

  serviceButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activeIndex = index;
      updateContent();
    });
  });

  nextButton.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % jobDetails.length;
    updateContent();
  });

  updateContent();
};

document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("main-header");
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const menuIcon = mobileMenuButton.querySelector("svg");

  const sections = [
    { id: "pocetna", element: document.getElementById("pocetna") },
    { id: "usluge", element: document.getElementById("usluge") },
    { id: "o-nama", element: document.getElementById("o-nama") },
    { id: "potrazivanja", element: document.getElementById("potrazivanja") },
    { id: "kontakt", element: document.getElementById("kontakt") },
  ].filter((section) => section.element !== null);

  let activeSection = "pocetna";
  let mobileMenuOpen = false;

  const handleScroll = () => {
    const isScrolled = window.scrollY > 20;

    if (isScrolled) {
      header.classList.remove("absolute");
      header.classList.add("fixed", "top-0");
      header.style.backgroundColor = "rgba(17, 24, 39, 0.1)";
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.classList.remove("fixed", "top-0");
      header.classList.add("absolute");
      header.style.backgroundColor = "transparent";
      header.style.backdropFilter = "none";
    }

    const currentPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const { id, element } = sections[i];
      if (element && element.offsetTop <= currentPosition) {
        if (activeSection !== id) {
          updateActiveSection(id);
        }
        break;
      }
    }
  };

  const updateActiveSection = (newActiveSection) => {
    activeSection = newActiveSection;
    window.activeSection = activeSection; // Make it accessible globally

    document.querySelectorAll("nav a[data-section]").forEach((link) => {
      const section = link.getAttribute("data-section");

      if (section === activeSection) {
        link.classList.add("text-primary-800");
        link.classList.remove("text-primary-700");

        let indicator = link.querySelector("span");
        if (!indicator) {
          indicator = document.createElement("span");
          indicator.className =
            "absolute bottom-0 left-0 w-full h-0.5 bg-primary-800 -mb-1";
          link.appendChild(indicator);
        }
      } else {
        link.classList.remove("text-primary-800");
        link.classList.add("text-primary-700");

        const indicator = link.querySelector("span");
        if (indicator) {
          link.removeChild(indicator);
        }
      }
    });

    // Also update mobile menu links
    const mobileLinks = document.querySelectorAll(
      "#mobile-menu-overlay a[data-mobile-section]",
    );
    mobileLinks.forEach((link) => {
      const section = link.getAttribute("data-mobile-section");

      // If this link matches the current section
      if (section === activeSection) {
        // Bold this link
        link.style.fontWeight = "bold";

        // Add underline if it doesn't exist
        if (!link.querySelector("span")) {
          const indicator = document.createElement("span");
          indicator.className =
            "absolute bottom-0 left-1/2 mb-0 h-1 w-16 -translate-x-1/2 transform";
          indicator.style.backgroundColor = "white";
          indicator.style.height = "2px";
          link.appendChild(indicator);
        }
      } else {
        // Normal weight for non-active links
        link.style.fontWeight = "normal";

        // Remove underline from non-active links
        const indicator = link.querySelector("span");
        if (indicator) {
          indicator.remove();
        }
      }
    });
  };

  const toggleMobileMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;

    if (mobileMenuOpen) {
      mobileMenuOverlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      menuIcon.innerHTML = `
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        `;
    } else {
      mobileMenuOverlay.classList.add("hidden");
      document.body.style.overflow = "auto";

      menuIcon.innerHTML = `
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        `;
    }
  };

  document.querySelectorAll("a[data-mobile-section]").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenuOpen) {
        toggleMobileMenu();
      }
    });
  });

  window.addEventListener("scroll", handleScroll);
  mobileMenuButton.addEventListener("click", toggleMobileMenu);

  handleScroll();
  initDetailsCarousel();
  initServicesCarousel();
  initMobileMenu();

  const heroForm = document.querySelector(".hero-form");
  if (heroForm) {
    heroForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(heroForm);
      formData.append("form_type", "hero");

      try {
        const response = await fetch("/php/mail.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const successMessage = document.createElement("div");
          successMessage.className =
            "mt-4 p-2 bg-primary-500 text-white rounded";
          successMessage.textContent = "Vaša poruka je uspešno poslata!";
          heroForm.appendChild(successMessage);

          heroForm.reset();

          setTimeout(() => {
            successMessage.remove();
          }, 5000);
        } else {
          alert(
            "Greška: " +
              (result.error || "Došlo je do greške prilikom slanja poruke."),
          );
        }
      } catch (error) {
        console.error("Greška:", error);
        alert("Došlo je do greške prilikom slanja poruke.");
      }
    });
  }

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      formData.append("form_type", "contact");

      try {
        const response = await fetch("/php/mail.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const successMessage = document.createElement("div");
          successMessage.className =
            "mt-4 p-2 bg-primary-500 text-white rounded";
          successMessage.textContent = "Vaša poruka je uspešno poslata!";
          contactForm.appendChild(successMessage);

          contactForm.reset();

          setTimeout(() => {
            successMessage.remove();
          }, 5000);
        } else {
          alert(
            "Greška: " +
              (result.error || "Došlo je do greške prilikom slanja poruke."),
          );
        }
      } catch (error) {
        console.error("Greška:", error);
        alert("Došlo je do greške prilikom slanja poruke.");
      }
    });
  }

  document.getElementById("current-year").textContent =
    new Date().getFullYear();
});
