import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { SearchUsers } from '../search/SearchUsers';
import { useLanguageStore } from '../../store/languageStore';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { translate } = useLanguageStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md border-b border-vercel-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <span className="text-white font-bold text-xl tracking-tight">KnightyTV</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200">
              {translate('nav.home')}
            </Link>
            <Link to="/podcasts" className="text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200">
              {translate('nav.videos')}
            </Link>
            
            <SearchUsers />
            <LanguageSwitcher />
            
            {user ? (
              <>
                <Link to="/admin" className="text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200">
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center text-gray-400 hover:text-white px-3 py-2 transition-colors duration-200"
                  >
                    <UserCircle className="h-5 w-5" />
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-vercel-card border border-vercel-border">
                      <div className="py-1" role="menu">
                        <Link
                          to={`/profile/${user.username}`}
                          className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-vercel-hover transition-colors duration-200"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <UserCircle className="h-4 w-4 mr-2" />
                            Profile
                          </div>
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-vercel-hover transition-colors duration-200"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </div>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-vercel-hover transition-colors duration-200"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="primary" size="sm">
                {translate('nav.signIn')}
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-vercel-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/podcasts"
              className="block text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200"
              onClick={toggleMenu}
            >
              Videos
            </Link>
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="block text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to={`/profile/${user.username}`}
                  className="block text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left text-gray-400 hover:text-white px-3 py-2 text-sm transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Button
                onClick={() => {
                  navigate('/auth');
                  toggleMenu();
                }}
                variant="primary"
                fullWidth
              >
                Sign In
              </Button>
            )}
            
            {/* Add SearchUsers to mobile menu */}
            <div className="px-3 py-2">
              <SearchUsers />
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
};