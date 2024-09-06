/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,js,jsx,tsx}'];
export const theme = {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      zomato: {
        DEFAULT: '#E03546',
        50: '#FFFFFF',
        100: '#FFFFFF',
        200: '#FBE6E8',
        300: '#F6C2C8',
        400: '#F09FA7',
        500: '#EB7C87',
        600: '#E55866',
        700: '#E03546',
        800: '#C01D2E',
        900: '#8F1622',
        950: '#77121C',
      },
    },
  },
};
export const plugins = [];
