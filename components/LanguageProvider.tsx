'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Language, Localized } from '@/data/types';
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (value: Localized) => string;
}>({ language: 'az', setLanguage: () => {}, t: (value) => value.az });
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('az');
  useEffect(() => {
    if (localStorage.getItem('museum-language') === 'en') setLanguage('en');
  }, []);
  function changeLanguage(value: Language) {
    setLanguage(value);
    localStorage.setItem('museum-language', value);
  }
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: changeLanguage, t: (value) => value[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
export function LanguageToggle({ dark = false }: { dark?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className={`language-toggle ${dark ? 'language-dark' : ''}`} aria-label="Language">
      {(['az', 'en'] as const).map((locale) => (
        <button
          key={locale}
          aria-label={locale === 'az' ? 'Azərbaycan dili' : 'English'}
          aria-pressed={language === locale}
          onClick={() => setLanguage(locale)}
          className={language === locale ? 'active' : ''}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
