// language-switcher.js
class LanguageSwitcher {
    constructor() {
        this.currentLang = 'ru'; 
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupLanguage());
        } else {
            this.setupLanguage();
        }
    }

    setupLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && translations[savedLang]) {
            this.currentLang = savedLang;
        }

        setTimeout(() => {
            this.applyLanguage(this.currentLang);
            this.setupEventListeners();
        }, 100);
    }

    applyLanguage(lang) {
        this.currentLang = lang;
        
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        const langCurrent = document.querySelector('.lang-current');
        if (langCurrent) {
            langCurrent.textContent = lang.toUpperCase();
        }


        localStorage.setItem('preferredLanguage', lang);

        console.log('Language changed to:', lang);
    }

    setupEventListeners() {
        const langOptions = document.querySelectorAll('.lang-menu li[data-lang]');
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.applyLanguage(lang);
                this.closeLanguageMenu();
            });
        });

        const langToggle = document.getElementById('langToggle');
        const langMenu = document.getElementById('langMenu');

        if (langToggle && langMenu) {
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                langMenu.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                this.closeLanguageMenu();
            });
        }
    }

    closeLanguageMenu() {
        const langMenu = document.getElementById('langMenu');
        if (langMenu) {
            langMenu.classList.remove('active');
        }
    }

    refreshTranslations() {
        this.applyLanguage(this.currentLang);
    }
}


const languageSwitcher = new LanguageSwitcher();