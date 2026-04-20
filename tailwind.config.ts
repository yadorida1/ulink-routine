import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#EAF4F2',
          200: '#C5E0DB',
          300: '#A3CEC8',
          400: '#86BDB7',
          500: '#7FAFA8',
          600: '#5C8F89',
          700: '#3F6F6A',
        },
        bg: '#F7FAF9',
        surface: '#FFFFFF',
        border: '#E3ECEA',
        'border-light': '#EEF5F3',
        'text-primary': '#2F3E3D',
        'text-secondary': '#8A9B99',
        'text-tertiary': '#B0C0BE',
        warning: '#C9A96E',
        error: '#C0706B',
        'muted-fill': '#F0F7F5',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
          'Noto Sans KR', 'sans-serif',
        ],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        full: '9999px',
      },
      maxWidth: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
};

export default config;
