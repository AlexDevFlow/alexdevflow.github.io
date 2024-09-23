gsap.registerPlugin(ScrollTrigger);

gsap.from("#home img", {
  opacity: 0,
  scale: 0.8,
  duration: 1.5,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#home",
    start: "top 80%",
    toggleActions: "play none none none",
  },
});

gsap.from(".hero-text", {
  opacity: 0,
  y: -50,
  duration: 1,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".hero-text",
    start: "top 80%",
  },
});

gsap.from("#about img", {
  opacity: 0,
  x: -50,
  duration: 2,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#about",
    start: "top 85%",
    toggleActions: "play none none none",
  },
});


gsap.from("#skills .skill-card:nth-child(1) li", {
  opacity: 0,
  x: -50, 
  duration: 0.8,
  stagger: 0.2, 
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#skills .skill-card:nth-child(1)", 
    start: "top 80%",
    toggleActions: "play none none none",
  },
});


gsap.from("#skills .skill-card:nth-child(2) li", {
  opacity: 0,
  x: -50, 
  duration: 0.8,
  stagger: 0.2, 
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#skills .skill-card:nth-child(2)", 
    start: "top 80%",
    toggleActions: "play none none none",
  },
});

gsap.from("#about .text-lg", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.3,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#about",
    start: "top 85%",
    toggleActions: "play none none none",
  },
});


gsap.from("#projects .project-card", {
  opacity: 0,
  duration: 1,
  stagger: 0.3, 
  ease: "power1.out",
  scrollTrigger: {
    trigger: "#projects", 
    start: "top 80%",
    toggleActions: "play none none none",
  },
});

const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
const mobileMenuClose = document.getElementById("mobile-menu-close");

function openMobileMenu() {
  mobileMenu.classList.add("active");
  mobileMenuOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  mobileMenuOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

mobileMenuToggle.addEventListener("click", openMobileMenu);
mobileMenuClose.addEventListener("click", closeMobileMenu);
mobileMenuOverlay.addEventListener("click", closeMobileMenu);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      closeMobileMenu();
      window.scrollTo({
        top: targetElement.offsetTop - 64,
        behavior: "smooth",
      });
    }
  });
});
