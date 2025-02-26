/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: '#FEED00',
        accent: '#453780',
        aqua: '#00AABA',
        'aqua-light': '#00E8F8',
        'aqua-dark': '#008D9D',
        'text-primary': '#FEED00',
        'text-secondary': '#420201'
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        '2.5xl': ['1.75rem', '2.125rem'],
        '4.5xl': ['2.5rem', '3rem']
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
      }
    },
  },
  plugins: [],
};
