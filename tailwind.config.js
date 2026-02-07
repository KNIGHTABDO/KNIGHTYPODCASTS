/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import rtl from 'tailwindcss-rtl';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'vercel': {
          'bg': '#000000',
          'card': '#111111',
          'border': '#333333',
          'hover': '#1a1a1a',
          'accent': '#ffffff',
          'muted': '#888888',
          'subtle': '#222222',
        },
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