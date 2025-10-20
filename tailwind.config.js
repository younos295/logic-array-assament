/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom light/dark colors
        brand: {
          DEFAULT: '#2469DD',
          light: '#2469DD',
          dark: '#2469DD',
        },
        // primary: {
        //   light: '#3B82F6', // Blue-500
        //   dark: '#1E40AF',  // Blue-900
        // },
        // secondary: {
        //   light: '#F59E0B',
        //   dark: '#B45309',
        // },
        tertiary: {
          light: '#475569',
          dark: '#94A3B8',
        },
        background: {
          light: '#F1F5F9',
          dark: '#0F172A',
        },
        'text-primary': {
          light: '#0F172A',
          dark: '#F8FAFC',
        },
        card: {
          light: '#ffffff',
          dark: '#020617',
        },
      },
      fontFamily: {
        geist: ['Geist', 'system-ui', 'sans-serif'],
        inter: ['Inter Tight', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enables theme switching with class="dark"
}
