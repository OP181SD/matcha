// tailwind.config.mjs

export const content = [
  './src/**/*.{js,jsx,ts,tsx}', 
];

export const theme = {
  extend: {
    colors: {
      matcha: {
        light: '#A8D08D',
        DEFAULT: '#5A7F3D',
        dark: '#3C5B3D',
      },
      cream: '#F9E8B5',
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      nunito: ['Nunito', 'sans-serif'] 
    },
  },
};

export const plugins = [
  require('daisyui'),
];

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