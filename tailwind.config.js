/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import rtl from 'tailwindcss-rtl';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'knighty': {
          'bg': '#050505',      // Deep rich black
          'card': '#0a0a0a',    // Slightly lighter black
          'border': '#262626',  // Neutral 800
          'hover': '#171717',   // Neutral 900
          'text': '#ededed',    // White-ish
          'muted': '#a1a1aa',   // Neutral 400
          'accent': '#f59e0b',  // Amber 500 (Star Gold)
          'danger': '#ef4444',  // Red 500
        },
        'vercel': { // Keep for backward compat until full refactor
          'bg': '#000000',
          'card': '#111111',
          'border': '#333333',
          'hover': '#1a1a1a',
          'accent': '#ffffff',
          'muted': '#888888',
          'subtle': '#222222',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-fade': 'linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0) 100%)',
      },
    },
  },
  plugins: [
    forms,
    rtl,
  ],
  darkMode: 'class',
};

export default config;