/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // --- Codecademy-style theme -----------------------------------------
        // Accent: electric indigo (Codecademy's signature CTA/link color).
        // Replaces the old terracotta "brand" scale app-wide.
        brand: {
          50: '#EFEDFD',
          100: '#DCD7FB',
          200: '#BDB4F7',
          300: '#9788F1',
          400: '#6E57EA',
          500: '#4F31E3',
          600: '#3A10E5',
          700: '#300CC0',
          800: '#280A9C',
          900: '#1F0A73',
        },
        // Codecademy pairs a warm cream canvas with cool navy-black text.
        // Light shades stay warm (paper/borders); dark shades go navy (ink).
        slate: {
          50: '#F2F0EA',
          100: '#ECEAE2',
          200: '#DEDBD0',
          300: '#CFCBBE',
          400: '#9C988D',
          500: '#6B6A66',
          600: '#494A52',
          700: '#33353F',
          800: '#20222D',
          900: '#14161F',
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
        // Chunkier, friendlier card lift to match the Codecademy feel.
        card: '0 1px 2px 0 rgb(20 22 31 / 0.04), 0 2px 10px 0 rgb(20 22 31 / 0.06)',
      },
    },
  },
  plugins: [],
}
