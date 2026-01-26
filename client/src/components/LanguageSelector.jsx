import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'pt', name: 'Português', flag: '🇵🇹' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
    ];

    const handleLanguageChange = (langCode) => {
        // Get current path segments
        const currentPath = window.location.pathname;
        const segments = currentPath.split('/');

        // Segments [0] is empty, [1] is 'fr' or 'en' etc.
        // Replace the language segment (index 1) with new lang
        if (segments.length > 1) {
            segments[1] = langCode;
        } else {
            // Edge case: just root, shouldn't happen with redirect but safe fallback
            segments.push(langCode);
        }

        const newPath = segments.join('/');
        i18n.changeLanguage(langCode); // Change state immediately
        // In a real app with react-router, we might want to use navigate() hook, 
        // but window.location ensures full reload/sync if needed, 
        // though navigate is smoother. Let's use useNavigate if we were inside hook, 
        // but here we can just update window.location.href or use a hook.
        // However, this component is inside the Router, so let's import useNavigate.
        window.location.href = newPath; // Simple for now
    };

    return (
        <div className="language-selector">
            <select
                onChange={(e) => handleLanguageChange(e.target.value)}
                value={i18n.language}
                className="language-select"
            >
                {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
