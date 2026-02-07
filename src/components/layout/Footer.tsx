import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-vercel-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <Tv className="h-6 w-6 text-white" />
              <span className="ml-2 text-xl font-bold text-white">KnightyTV</span>
            </Link>
            <p className="text-vercel-muted text-sm">
              Your destination for discovering and watching amazing video content.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/podcasts" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Videos
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/podcasts?category=quran" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Quran
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=hadith" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Hadith
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=fiqh" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Fiqh
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=seerah" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Seerah
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=history" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
                  Islamic History
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-vercel-muted hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-vercel-muted hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-vercel-muted hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="mailto:contact@knightytv.com" className="text-vercel-muted hover:text-white transition-colors duration-200">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
            <p className="mt-4 text-vercel-muted text-sm">
              Subscribe to our newsletter for updates
            </p>
            <div className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l-lg border border-vercel-border bg-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-white/25 transition-colors duration-200"
              />
              <button className="rounded-r-lg bg-white px-3 py-2 text-sm font-medium text-black hover:bg-gray-200 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-vercel-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-vercel-muted text-sm">
            &copy; {new Date().getFullYear()} KnightyTV. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-vercel-muted hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};