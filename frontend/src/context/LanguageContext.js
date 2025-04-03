import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo context cho ngôn ngữ
const LanguageContext = createContext();

// Các ngôn ngữ được hỗ trợ
export const languages = {
    VI: 'vi',
    EN: 'en',
    ZH: 'zh',
};

// Provider component
export const LanguageProvider = ({ children }) => {
    // Lấy ngôn ngữ từ localStorage hoặc mặc định là tiếng Việt
    const [language, setLanguage] = useState(() => {
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage || languages.VI;
    });

    // Lưu ngôn ngữ vào localStorage khi thay đổi
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Hàm chuyển đổi ngôn ngữ
    const toggleLanguage = () => {
        setLanguage(prevLang => {
            if (prevLang === languages.VI) return languages.EN;
            if (prevLang === languages.EN) return languages.ZH;
            return languages.VI;
        });
    };


    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook để sử dụng context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext; 