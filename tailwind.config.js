/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gem: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          glow: '#ff6a00',
        },
        brand: {
          bg: '#08080A',
          card: '#111216',
          cardLight: '#181920',
          border: '#272935',
          gold: '#D4AF37',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gem: '0 0 40px -10px rgba(249, 115, 22, 0.35)',
        'gem-lg': '0 0 70px -15px rgba(249, 115, 22, 0.45)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gem-gradient': 'linear-gradient(135deg, #ff7a18 0%, #af002d 50%, #319197 100%)',
        gemstone: 'linear-gradient(135deg, #FF6B00 0%, #FFA800 40%, #E63900 100%)',
        'gemstone-dark':
          'linear-gradient(180deg, rgba(255, 107, 0, 0.15) 0%, rgba(255, 107, 0, 0.02) 100%)',
      },
    },
  },
  plugins: [],
};
