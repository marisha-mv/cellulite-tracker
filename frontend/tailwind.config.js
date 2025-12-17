/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4A5A5',
          light: '#E8C4C4',
          dark: '#B88A8A',
        },
        secondary: {
          DEFAULT: '#FAF6F3',
          dark: '#F0EBE7',
        },
        accent: {
          DEFAULT: '#2D5F5D',
          light: '#3D7F7D',
          dark: '#1D4F4D',
        },
        success: '#81C784',
        background: '#FEFEFE',
        neutral: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant', 'Georgia', 'serif'],
      },
      borderRadius: {
        'premium': '12px',
        'premium-lg': '16px',
      },
      boxShadow: {
        'premium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
