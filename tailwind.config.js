/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,js,jsx,tsx}'];
export const theme = {
  extend: {
    fontFamily: {
      display: ['Fraunces', 'Georgia', 'serif'],
      sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      brand: ['Fredoka', '"DM Sans"', 'system-ui', 'sans-serif'],
    },
    colors: {
      cream: {
        50: '#FFFBF3',
        100: '#FBF3E6',
        200: '#F5E7D0',
        300: '#EFD9B4',
      },
      espresso: {
        50: '#F5E9DE',
        700: '#5A2E1F',
        800: '#3D1F14',
        900: '#2A140C',
      },
      zomato: {
        DEFAULT: '#E23744',
        50: '#FFF1F2',
        100: '#FFE0E3',
        200: '#FFBFC4',
        300: '#FB9098',
        400: '#F45D69',
        500: '#E23744',
        600: '#C81E2B',
        700: '#A11522',
        800: '#7D101A',
        900: '#561009',
      },
      swiggy: {
        DEFAULT: '#FC8019',
        50: '#FFF4E6',
        100: '#FFE3BF',
        200: '#FFCD8C',
        300: '#FFB358',
        400: '#FE9A2E',
        500: '#FC8019',
        600: '#E0670A',
        700: '#B85108',
        800: '#8C3D08',
        900: '#5C2706',
      },
    },
    boxShadow: {
      card: '0 1px 0 rgba(61, 31, 20, 0.04), 0 8px 28px -10px rgba(61, 31, 20, 0.18)',
      pop: '0 6px 24px -6px rgba(226, 55, 68, 0.45)',
    },
    borderRadius: {
      xl2: '1.25rem',
      '3xl': '1.75rem',
    },
  },
};
export const plugins = [];
