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
const mobileMenuClose = document.getElementById("mobile-menu-close");

function openMobileMenu() {
  mobileMenu.classList.add("active");
  document.body.style.overflow = "hidden";
  mobileMenuToggle.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  mobileMenu.classList.remove("active");
  document.body.style.overflow = "";
  mobileMenuToggle.setAttribute("aria-expanded", "false");
}

mobileMenuToggle.addEventListener("click", openMobileMenu);
mobileMenuClose.addEventListener("click", closeMobileMenu);

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

// Language toggle and translations
const translations = {
  en: {
    "meta.title": "Alessandro Trysh - Software Developer",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "hero.tagline": "Software Developer & Technology Enthusiast",
    "hero.cta": "Contact Me",
    "about.title": "About Me",
    "about.p1": "I am a computer science student with a strong passion for automation, artificial intelligence, and cybersecurity. My goal is to apply my skills in innovative and challenging environments, contributing to projects that have a significant impact.",
    "about.p2": "Today I collaborate with small and medium businesses, helping them build websites, visuals, and providing consulting to understand their real needs.",
    "about.cta": "Do you think this fits you? Let's talk!",
    "skills.title": "My Skills",
    "skills.languages.title": "Languages",
    "skills.languages.python": "<strong>Python</strong> (Flask, BS4, Telegram API)",
    "skills.languages.javascript": "<strong>JavaScript</strong>",
    "skills.languages.java": "<strong>Java</strong>",
    "skills.languages.rust": "<strong>Rust</strong> (with Tauri for GUI)",
    "skills.os.title": "Operating Systems",
    "skills.os.linux": "<strong>Linux</strong> (Fedora, Pop!_OS)",
    "skills.os.windows": "<strong>Windows</strong> (Windows Server 2019)",
    "skills.other.title": "Other",
    "skills.other.sql": "<strong>SQL</strong> (MySQL & SQLite)",
    "skills.other.cloud": "<strong>Vercel, Railway</strong>",
    "skills.other.bash": "<strong>Bash</strong>",
    "projects.title": "Projects",
    "projects.p1.title": "Telegram bot and website for school circulars",
    "projects.p1.desc": "Developed a Python bot with BS4 and Telegram API to extract circulars from the school website and send them to students. Also developed a website with Flask to show circulars and substitutions, with browser notifications.",
    "projects.p1.ctaBot": "<i class=\"fab fa-telegram mr-2\"></i>See the bot",
    "projects.p1.ctaSite": "<i class=\"fas fa-link mr-2\"></i>Visit the website",
    "projects.p2.title": "MVP of a contest app",
    "projects.p2.desc": "Prototype in Flask to create and manage online competitions, validated with early interest from users.",
    "projects.p2.cta": "<i class=\"fas fa-lock mr-2\"></i>Closed source",
    "projects.p3.title": "Nautilus extension for file conversion",
    "projects.p3.desc": "Bash + FFMPEG script that adds a conversion action to Nautilus for quick media transforms on Linux.",
    "projects.p3.cta": "<i class=\"fas fa-link mr-2\"></i>Visit Project",
    "projects.p4.title": "Quiz Platform (LLM-powered)",
    "projects.p4.desc": "FastAPI webapp that generates and grades quizzes with LLMs, supports reference files, style mimic, and configurable question types and counts.",
    "projects.p4.ctaClosed": "<i class=\"fas fa-lock mr-2\"></i>Closed source",
    "projects.p5.title": "ZeroSec Spectre",
    "projects.p5.desc": "LLM-powered cybersecurity framework for rapid offense/defense: file-map context, intel pipeline, task engine, safeguards, RBAC, and human-in-the-loop controls.",
    "projects.p5.ctaDiscuss": "<i class=\"fas fa-comments mr-2\"></i>Let's discuss",
    "contact.title": "Contact me",
    "contact.subtitle": "You can contact me through:",
    "footer.copy": "© 2024 Alessandro Trysh. All rights reserved.",
    "footer.credit": "Thanks to <a href=\"https://notioly.com/\">notioly</a> for the icons!"
  },
  it: {
    "meta.title": "Alessandro Trysh - Sviluppatore Software",
    "nav.home": "Home",
    "nav.about": "Chi sono",
    "nav.skills": "Competenze",
    "nav.projects": "Progetti",
    "nav.contact": "Contatti",
    "nav.menu": "Menu",
    "hero.tagline": "Sviluppatore software e appassionato di tecnologia",
    "hero.cta": "Contattami",
    "about.title": "Chi sono",
    "about.p1": "Sono uno studente di informatica con una forte passione per l'automazione, l'intelligenza artificiale e la cybersecurity. Il mio obiettivo è applicare le mie competenze in contesti innovativi e stimolanti, contribuendo a progetti ad alto impatto.",
    "about.p2": "Oggi collaboro con piccole e medie imprese aiutandole a sviluppare siti web, grafiche e fornendo consulenza per comprendere le loro reali necessità.",
    "about.cta": "Pensi sia il tuo caso? Parliamone!",
    "skills.title": "Competenze",
    "skills.languages.title": "Linguaggi",
    "skills.languages.python": "<strong>Python</strong> (Flask, BS4, Telegram API)",
    "skills.languages.javascript": "<strong>JavaScript</strong>",
    "skills.languages.java": "<strong>Java</strong>",
    "skills.languages.rust": "<strong>Rust</strong> (con Tauri per GUI)",
    "skills.os.title": "Sistemi Operativi",
    "skills.os.linux": "<strong>Linux</strong> (Fedora, Pop!_OS)",
    "skills.os.windows": "<strong>Windows</strong> (Windows Server 2019)",
    "skills.other.title": "Altro",
    "skills.other.sql": "<strong>SQL</strong> (MySQL e SQLite)",
    "skills.other.cloud": "<strong>Vercel, Railway</strong>",
    "skills.other.bash": "<strong>Bash</strong>",
    "projects.title": "Progetti",
    "projects.p1.title": "Bot Telegram e sito per circolari scolastiche",
    "projects.p1.desc": "Ho sviluppato un bot Python con BS4 e Telegram API per estrarre le circolari dal sito della scuola e inviarle agli studenti. Ho creato anche un sito Flask per mostrare circolari e sostituzioni con notifiche del browser.",
    "projects.p1.ctaBot": "<i class=\"fab fa-telegram mr-2\"></i>Vedi il bot",
    "projects.p1.ctaSite": "<i class=\"fas fa-link mr-2\"></i>Visita il sito",
    "projects.p2.title": "MVP di un'app per contest",
    "projects.p2.desc": "Prototipo in Flask per creare e gestire competizioni online, validato con interesse iniziale dagli utenti.",
    "projects.p2.cta": "<i class=\"fas fa-lock mr-2\"></i>Codice non pubblico",
    "projects.p3.title": "Estensione Nautilus per la conversione di file",
    "projects.p3.desc": "Script Bash + FFMPEG che aggiunge un'azione di conversione a Nautilus per trasformare rapidamente i media su Linux.",
    "projects.p3.cta": "<i class=\"fas fa-link mr-2\"></i>Visita il progetto",
    "projects.p4.title": "Quiz Platform (LLM-powered)",
    "projects.p4.desc": "Webapp FastAPI che genera e valuta quiz con LLM, supporta file di riferimento, imitazione di stile e domande configurabili per numero e tipologia.",
    "projects.p4.ctaClosed": "<i class=\"fas fa-lock mr-2\"></i>Codice non pubblico",
    "projects.p5.title": "ZeroSec Spectre",
    "projects.p5.desc": "Framework cybersecurity con LLM per offence/defence rapida: file-map per il contesto, pipeline di intelligence, motore di task, salvaguardie, RBAC e controllo umano opzionale.",
    "projects.p5.ctaDiscuss": "<i class=\"fas fa-comments mr-2\"></i>Parliamone",
    "contact.title": "Contattami",
    "contact.subtitle": "Puoi contattarmi tramite:",
    "footer.copy": "© 2024 Alessandro Trysh. Tutti i diritti riservati.",
    "footer.credit": "Grazie a <a href=\"https://notioly.com/\">notioly</a> per le icone!"
  }
};

const storageKey = "alexdevflow-lang";
const langToggle = document.getElementById("portfolioLangToggle");

function applyPortfolioTranslations(lang) {
  if (!translations[lang]) return;
  document.documentElement.lang = lang;
  document.title = translations[lang]["meta.title"] || document.title;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = translations[lang][key];
    if (!value) return;
    el.innerHTML = value;
  });
  langToggle.textContent = lang === "it" ? "🇮🇹 Italiano" : "🇬🇧 English";
  langToggle.setAttribute("aria-pressed", lang === "it" ? "true" : "false");
}

function initPortfolioLanguage() {
  const saved = localStorage.getItem(storageKey);
  const browserLang = (navigator.language || "en").slice(0, 2);
  const startingLang = saved || (browserLang === "it" ? "it" : "en");
  applyPortfolioTranslations(startingLang);
}

langToggle.addEventListener("click", () => {
  const current = document.documentElement.lang === "it" ? "it" : "en";
  const next = current === "en" ? "it" : "en";
  localStorage.setItem(storageKey, next);
  applyPortfolioTranslations(next);
});

initPortfolioLanguage();
