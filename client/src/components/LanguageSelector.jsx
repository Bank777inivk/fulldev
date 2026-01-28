import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'fr', name: 'Français', flag: '/flags/fr.png' },
        { code: 'en', name: 'English', flag: '/flags/gb.png' },
        { code: 'es', name: 'Español', flag: '/flags/es.png' },
        { code: 'it', name: 'Italiano', flag: '/flags/it.png' },
        { code: 'pt', name: 'Português', flag: '/flags/pt.png' },
        { code: 'de', name: 'Deutsch', flag: '/flags/de.png' }
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        const currentPath = location.pathname;
        const segments = currentPath.split('/');
        if (segments.length > 1) {
            segments[1] = langCode;
        } else {
            segments.push(langCode);
        }
        const newPath = segments.join('/');

        // Update language state and navigate without reload
        i18n.changeLanguage(langCode);
        navigate(newPath);
        setIsOpen(false);
    };

    return (
        <div className="language-selector-wrapper" ref={dropdownRef} style={styles.wrapper}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={styles.trigger}
                className="lang-trigger"
            >
                <img src={currentLang.flag} alt={currentLang.name} style={styles.flagImg} />
                <i className={`fas fa-chevron-down ${isOpen ? 'rotate' : ''}`} style={styles.arrow}></i>
            </button>

            {isOpen && (
                <div style={styles.dropdown} className="lang-dropdown animate-in">
                    {languages.map(lang => (
                        <div
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            style={{
                                ...styles.option,
                                backgroundColor: i18n.language === lang.code ? '#f8fafc' : 'transparent',
                                fontWeight: i18n.language === lang.code ? '700' : '400'
                            }}
                            className="lang-option"
                        >
                            <img src={lang.flag} alt={lang.name} style={styles.optionFlagImg} />
                            <span style={styles.optionName}>{lang.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        position: 'relative',
        display: 'inline-block',
    },
    trigger: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #e2e8f0',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    },
    flagImg: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1px solid #eee',
    },
    arrow: {
        fontSize: '0.7rem',
        color: '#64748b',
        transition: 'transform 0.2s ease',
    },
    dropdown: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
        border: '1px solid #e2e8f0',
        minWidth: '180px',
        zIndex: 1001,
        overflow: 'hidden',
        padding: '6px',
    },
    option: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        borderRadius: '10px',
        transition: 'all 0.2s ease',
    },
    optionFlagImg: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    optionName: {
        color: '#1e293b',
    }
};

export default LanguageSelector;
