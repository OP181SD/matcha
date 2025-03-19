// tailwind.config.mjs

export const content = [
  './src/**/*.{js,jsx,ts,tsx}', 
];

// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{html,js,jsx}', // Assure-toi que ton contenu est pris en compte
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          light: '#A8D08D',    // Couleur claire matcha
          DEFAULT: '#5A7F3D',   // Couleur principale matcha
          dark: '#3C5B3D',      // Couleur foncée matcha
        },
        cream: '#F9E8B5',         // Couleur cream
        pink: '#FC9FB1',          // Couleur pink
        tea: '#74a12e',           // Couleur tea
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      screens: {
        sm: '640px',  // Petit écran
        md: '768px',  // Moyen écran
        lg: '1024px', // Grand écran
        xl: '1280px', // Très grand écran
      },
    },
  },
  plugins: [],
}




export const daisyui = {
  themes: [
    {
      matcha: {
        "primary": "#5A7F3D",
        "secondary": "#A8D08D",
        "accent": "#F9E8B5",
        "neutral": "#3C5B3D",
        "base-100": "#FFFFFF",
        "info": "#3ABFF8",
        "success": "#36D399",
        "warning": "#FBBD23",
        "error": "#F87272",
      },
    },
  ],
};