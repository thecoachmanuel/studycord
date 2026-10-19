import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ef5388',
          light: '#ef5388',
          dark: '#f279a2',
        },
        pageBg: {
          light: '#f3f7fa',
          dark: '#233354',
        },
        surface: {
          light: '#ffffff',
          dark: '#294261',
        },
        primaryText: {
          light: '#45536d',
          dark: '#fefefe',
        },
        correct: '#5DB760',
        wrong: '#FF6169',
        hurryTimer: '#FF6169',
        pending: '#FFA726',
      },
      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        'app-card': '10px',
        'app-bottom-nav': '20px',
        'app-modal': '20px',
      },
      boxShadow: {
        'bottom-nav': '0 -4px 16px rgba(0, 0, 0, 0.08)',
        'app-card': '0 5px 15px rgba(69, 83, 109, 0.1)',
        'primary-glow': '0 4px 12px rgba(239, 83, 136, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
