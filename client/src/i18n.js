import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { auth } from './firebase/config';

i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'fr', // Default language if detection fails or translation missing
        debug: false, // Set to false in production

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        // Backend options
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },

        // Detection options
        detection: {
            order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            lookupQuerystring: 'lang',
            caches: ['localStorage', 'cookie'],
        },

        // Supported languages
        supportedLngs: ['fr', 'en', 'es', 'it', 'pt', 'de'],
    });

// Keep Firebase Auth language in sync with i18next
i18n.on('languageChanged', (lng) => {
    if (auth) {
        auth.languageCode = lng;
        console.log(`Firebase Auth language set to: ${lng}`);
    }
    // Update HTML lang attribute for accessibility and browser detection
    document.documentElement.lang = lng;
});

export default i18n;
