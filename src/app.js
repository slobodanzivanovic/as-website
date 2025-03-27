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
        buttonDiv.classList.add("ring-2", "ring-blue-300");

        if (!highlightDiv) {
          const div = document.createElement("div");
          div.className =
            "absolute -inset-3 border border-blue-300 rounded-full opacity-20";
          button.querySelector("div").appendChild(div);
        }
      } else {
        button.classList.remove("transform", "scale-110");
        button.classList.add("opacity-70");
        buttonDiv.classList.remove("ring-2", "ring-blue-300");

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
      header.style.backgroundColor = "rgba(17, 24, 39, 0.5)";
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

    document.querySelectorAll("nav a[data-section]").forEach((link) => {
      const section = link.getAttribute("data-section");

      if (section === activeSection) {
        link.classList.add("text-blue-800");
        link.classList.remove("text-gray-700");

        let indicator = link.querySelector("span");
        if (!indicator) {
          indicator = document.createElement("span");
          indicator.className =
            "absolute bottom-0 left-0 w-full h-0.5 bg-blue-800 -mb-1";
          link.appendChild(indicator);
        }
      } else {
        link.classList.remove("text-blue-800");
        link.classList.add("text-gray-700");

        const indicator = link.querySelector("span");
        if (indicator) {
          link.removeChild(indicator);
        }
      }
    });

    document.querySelectorAll("a[data-mobile-section]").forEach((link) => {
      const section = link.getAttribute("data-mobile-section");

      if (section === activeSection) {
        link.classList.add("text-teal-300");
        link.classList.remove("text-white");

        let indicator = link.querySelector("span");
        if (!indicator) {
          indicator = document.createElement("span");
          indicator.className =
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-teal-300 mb-0";
          link.appendChild(indicator);
        }
      } else {
        link.classList.remove("text-teal-300");
        link.classList.add("text-white");

        const indicator = link.querySelector("span");
        if (indicator) {
          link.removeChild(indicator);
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
});
