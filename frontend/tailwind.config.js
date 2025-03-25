// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          light: '#A8D08D',   // Vert matcha clair
          DEFAULT: '#F6F3ED', // Beige matcha principal
          dark: '#3C5B3D',    // Vert foncé matcha
        },
        pen: '#594347',      // Brun foncé pour le texte et les bordures
        pink: '#F2C9D4',     // Rose pâle pour les boutons
        tea: '#A6BF80',      // Vert thé pour les boutons et accents
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      screens: {
        sm: '640px',  // Petits écrans
        md: '768px',  // Écrans moyens
        lg: '1024px', // Grands écrans
        xl: '1280px', // Très grands écrans
      },
    },
  },
  plugins: [],
}
