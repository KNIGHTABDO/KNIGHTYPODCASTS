import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';
import { Button } from './Button';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
    </Button>
  );
};
