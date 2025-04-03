import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations/translations';

export const useTranslation = () => {
    const { language } = useLanguage();

    const t = (key) => {
        if (!translations[language] || !translations[language][key]) {
            console.warn(`Translation '${key}' for language '${language}' not found.`);
            return key;
        }
        return translations[language][key];
    };

    return { t };
}; 