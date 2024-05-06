/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'custom-pink': '#e94057',
        'custom-orange': '#f27121',
      },
    },
    fontFamily: {
      'display': ['"Archivo Narrow"', 'sans-serif'],
      'body': ['"Archivo"', 'sans-serif'],
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

