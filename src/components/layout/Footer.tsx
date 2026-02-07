import React from 'react';
import { Link } from 'react-router-dom';
import { Tv } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

export const Footer: React.FC = () => {
  const { translate } = useLanguageStore();
  
  return (
    <footer className="bg-black border-t border-vercel-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Brand and Description */}
          <div className="space-y-2">
            <Link to="/" className="flex items-center">
              <Tv className="h-5 w-5 text-white" />
              <span className="ml-2 text-lg font-semibold text-white">KnightyTV</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {translate('footer.description')}
            </p>
          </div>
          
          {/* Middle: Essential Navigation */}
          <div className="md:flex md:justify-center">
            <div>
              <h3 className="text-white font-medium mb-3 text-sm">{translate('footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {translate('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/podcasts" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {translate('nav.videos')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                    {translate('nav.about')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right: Empty for now - can add social links when accounts exist */}
          <div className="hidden md:block"></div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-vercel-border/50">
          <p className="text-gray-500 text-xs text-center">
            {translate('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};