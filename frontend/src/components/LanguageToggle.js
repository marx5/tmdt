import React from 'react';
import { Button } from 'react-bootstrap';
import { useLanguage, languages } from '../context/LanguageContext';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <Button
            variant="outline-light"
            size="sm"
            onClick={toggleLanguage}
            className="ml-2"
        >
            {language === languages.VI ? 'EN' : language === languages.EN ? '中文' : 'VI'}

        </Button>
    );
};

export default LanguageToggle; 