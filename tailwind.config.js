/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import rtl from 'tailwindcss-rtl';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    rtl,
  ],
  darkMode: 'class',
};

export default config;