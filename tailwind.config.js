/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // --- Soft theme -----------------------------------------------------
        // Accent: muted teal — calm, low-saturation, friendly on cream.
        brand: {
          50: '#E6F2F1',
          100: '#C9E6E5',
          200: '#A3D4D2',
          300: '#6FB9B6',
          400: '#3C9D9A',
          500: '#0E7C7B',
          600: '#0B6160',
          700: '#094E4D',
          800: '#073E3E',
          900: '#063231',
        },
        // Warm cream canvas paired with a soft warm-charcoal ink (not the
        // harsher navy-black from before). Light shades stay warm paper.
        slate: {
          50: '#F2F0EA',
          100: '#ECEAE2',
          200: '#DEDBD0',
          300: '#CFCBBE',
          400: '#9C988D',
          500: '#6E6B64',
          600: '#57544E',
          700: '#46443F',
          800: '#34322E',
          900: '#2B2A28',
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
        card: '0 1px 2px 0 rgb(43 42 40 / 0.04), 0 2px 10px 0 rgb(43 42 40 / 0.06)',
      },
    },
  },
  plugins: [],
}
