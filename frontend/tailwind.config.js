// tailwind.config.js

module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          light: '#A8D08D',   
          DEFAULT: '#F6F3ED', 
          dark: '#3C5B3D',    
        },
        pen: '#594347',     
        pink: '#F2C9D4',     
        tea: '#A6BF80',     
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
