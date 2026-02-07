import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useLanguageStore } from '../../store/languageStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentLanguage } = useLanguageStore();

  return (
    <div className={`min-h-screen bg-black ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};