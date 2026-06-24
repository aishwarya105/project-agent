/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // --- Editorial Warm theme -------------------------------------------
        // Accent: terracotta. Replaces the old blue "brand" scale, so every
        // `brand-*` utility across the app becomes terracotta automatically.
        brand: {
          50: '#FBF1EC',
          100: '#F8E3D8',
          200: '#F0C6B0',
          300: '#E5A183',
          400: '#D97650',
          500: '#C2410C',
          600: '#AA380A',
          700: '#8A2D08',
          800: '#6E2507',
          900: '#5A1F07',
        },
        // Override the cool `slate` scale with a warm paper/stone scale. Every
        // existing `slate-*` class (text, borders, backgrounds) shifts warm
        // without touching component markup. 50 is the cream canvas; 900 ink.
        slate: {
          50: '#FAF7F2',
          100: '#F2ECE3',
          200: '#E7DFD3',
          300: '#D8CEC0',
          400: '#A89F90',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        // Body stays in Inter; headings use Fraunces for the editorial feel.
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        // Softer, warmer card shadow than the cool default.
        card: '0 1px 2px 0 rgb(28 25 23 / 0.04), 0 1px 3px 0 rgb(28 25 23 / 0.06)',
      },
    },
  },
  plugins: [],
}
