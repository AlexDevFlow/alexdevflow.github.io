document.addEventListener("DOMContentLoaded", function () {
    const translations = {
        en: {
            "blog.title": "Blog",
            "blog.message": "Nothing to see here yet, the inspiration is still flowing...",
            "blog.back": "Go Back Home",
        },
        it: {
            "blog.title": "Blog",
            "blog.message": "Niente da vedere qui per ora, l'ispirazione sta ancora scorrendo...",
            "blog.back": "Torna alla Home",
        },
    };

    const storageKey = "alexdevflow-lang";
    const typingElement = document.querySelector(".typing-text");
    const langToggle = document.getElementById("blogLangToggle");
    let typingTimeout = null;

    function typeWriter(text, index = 0) {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            typingTimeout = setTimeout(() => typeWriter(text, index + 1), 70);
        }
    }

    function startTyping(lang) {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        typingElement.textContent = "";
        const text = translations[lang]["blog.message"];
        typeWriter(text, 0);
    }

    function applyTranslations(lang) {
        if (!translations[lang]) return;
        document.documentElement.lang = lang;
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.dataset.i18n;
            const value = translations[lang][key];
            if (!value) return;
            if (el === typingElement) {
                startTyping(lang);
            } else {
                el.textContent = value;
            }
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
});