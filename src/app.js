const initMobileMenu = () => {
  const style = document.createElement("style");
  style.textContent = `
    #mobile-menu-overlay a {
      color: #e9edef !important;
      opacity: 1 !important;
    }
    
    #mobile-menu-overlay a[data-mobile-section].active span,
    #mobile-menu-overlay a[data-mobile-section="pocetna"] span {
      display: none !important;
    }
    
    #mobile-menu-overlay a[data-mobile-section]::after {
      display: none !important;
    }
    
    #mobile-menu-overlay a {
      border-color: rgba(233, 237, 239, 0.2) !important;
    }
    
    #mobile-menu-overlay {
      background-color: #283134 !important;
    }
  `;
  document.head.appendChild(style);

  const mobileLinks = document.querySelectorAll(
    "#mobile-menu-overlay a[data-mobile-section]",
  );

  const updateMobileMenu = () => {
    const currentSection = window.activeSection || "pocetna";

    mobileLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-mobile-section");

      if (linkSection === currentSection) {
        link.style.fontWeight = "bold";
      } else {
        link.style.fontWeight = "normal";
      }

      const indicator = link.querySelector("span");
      if (indicator) {
        indicator.remove();
      }
    });
  };

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
    slides.forEach((slide) => {
      slide.style.display = "none";
      slide.style.opacity = 0;
    });

    slides[currentIndex].style.display = "block";
    setTimeout(() => {
      slides[currentIndex].style.opacity = 1;
    }, 10);

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add("active", "bg-primary-400", "opacity-90");
        dot.classList.remove("bg-primary-100", "opacity-50");
      } else {
        dot.classList.remove("active", "bg-primary-400", "opacity-90");
        dot.classList.add("bg-primary-100", "opacity-50");
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

  let autoplayInterval;

  const startAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }

    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  };

  startAutoplay();

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

  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname === "/index.html" ||
    window.location.pathname === "/index" ||
    window.location.pathname.endsWith("/index.html");

  if (!isHomePage) {
    document.querySelectorAll("nav a[data-section]").forEach((link) => {
      link.classList.remove("text-primary-50");
      link.classList.add("text-primary-100");
      const indicator = link.querySelector("span");
      if (indicator) {
        link.removeChild(indicator);
      }
    });

    document
      .querySelectorAll("#mobile-menu-overlay a[data-mobile-section]")
      .forEach((link) => {
        link.style.fontWeight = "normal";
        const indicator = link.querySelector("span");
        if (indicator) {
          indicator.remove();
        }
      });

    if (!document.getElementById("mobile-nav-no-effects")) {
      const style = document.createElement("style");
      style.id = "mobile-nav-no-effects";
      style.textContent = `
        #mobile-menu-overlay a[data-mobile-section]::after {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

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
      header.style.backgroundColor = "rgba(81, 104, 110, 0.85)";
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.classList.remove("fixed", "top-0");
      header.classList.add("absolute");
      header.style.backgroundColor = "transparent";
      header.style.backdropFilter = "none";
    }

    if (isHomePage) {
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
    }
  };

  const updateActiveSection = (newActiveSection) => {
    activeSection = newActiveSection;
    window.activeSection = activeSection;

    if (isHomePage) {
      document.querySelectorAll("nav a[data-section]").forEach((link) => {
        const section = link.getAttribute("data-section");

        if (section === activeSection) {
          link.classList.add("text-primary-50");
          link.classList.remove("text-primary-100");

          let indicator = link.querySelector("span");
          if (!indicator) {
            indicator = document.createElement("span");
            indicator.className =
              "absolute bottom-0 left-0 w-full h-0.5 bg-primary-50 -mb-1";
            link.appendChild(indicator);
          }
        } else {
          link.classList.remove("text-primary-50");
          link.classList.add("text-primary-100");

          const indicator = link.querySelector("span");
          if (indicator) {
            link.removeChild(indicator);
          }
        }
      });

      const mobileLinks = document.querySelectorAll(
        "#mobile-menu-overlay a[data-mobile-section]",
      );
      mobileLinks.forEach((link) => {
        const section = link.getAttribute("data-mobile-section");

        if (section === activeSection) {
          link.style.fontWeight = "bold";
        } else {
          link.style.fontWeight = "normal";
        }

        const indicator = link.querySelector("span");
        if (indicator) {
          indicator.remove();
        }
      });
    }
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
            "mt-4 p-2 bg-primary-500 text-primary-50 rounded";
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
            "mt-4 p-2 bg-primary-500 text-primary-50 rounded";
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
