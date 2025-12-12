const translations = {
  en: {
    "home.subtitle": "Computer Science Student & Developer",
    "home.cardPortfolio": "Portfolio",
    "home.cardBlog": "Blog",
    "home.cardLab": "Lab"
  },
  it: {
    "home.subtitle": "Studente di Informatica e Sviluppatore",
    "home.cardPortfolio": "Portfolio",
    "home.cardBlog": "Blog",
    "home.cardLab": "Laboratorio"
  }
};

const langToggle = document.getElementById("langToggle");
const storageKey = "alexdevflow-lang";

function applyTranslations(lang) {
  if (!translations[lang]) return;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = translations[lang][key];
    if (!value) return;
    el.textContent = value;
  });
  langToggle.textContent = lang === "it" ? "🇮🇹 Italiano" : "🇬🇧 English";
  langToggle.setAttribute("aria-pressed", lang === "it" ? "true" : "false");
}

function initLanguage() {
  const saved = localStorage.getItem(storageKey);
  const browserLang = (navigator.language || "en").slice(0, 2);
  const startingLang = saved || (browserLang === "it" ? "it" : "en");
  applyTranslations(startingLang);
}

langToggle.addEventListener("click", () => {
  const current = document.documentElement.lang === "it" ? "it" : "en";
  const next = current === "en" ? "it" : "en";
  localStorage.setItem(storageKey, next);
  applyTranslations(next);
});

initLanguage();
