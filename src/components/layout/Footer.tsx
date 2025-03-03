import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Mail, Instagram, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <Moon className="h-8 w-8 text-green-500" />
              <span className="ml-2 text-xl font-bold text-white">Islamic Podcasts</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Providing authentic Islamic knowledge through engaging podcasts and videos.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/podcasts" className="text-gray-400 hover:text-white text-sm">
                  Podcasts
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-400 hover:text-white text-sm">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/podcasts?category=quran" className="text-gray-400 hover:text-white text-sm">
                  Quran
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=hadith" className="text-gray-400 hover:text-white text-sm">
                  Hadith
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=fiqh" className="text-gray-400 hover:text-white text-sm">
                  Fiqh
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=seerah" className="text-gray-400 hover:text-white text-sm">
                  Seerah
                </Link>
              </li>
              <li>
                <Link to="/podcasts?category=history" className="text-gray-400 hover:text-white text-sm">
                  Islamic History
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="mailto:contact@islamicpodcasts.com" className="text-gray-400 hover:text-white">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Subscribe to our newsletter for updates
            </p>
            <div className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-l-md border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button className="rounded-r-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Islamic Podcasts. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};