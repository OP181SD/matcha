module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        matcha: {
          light: '#A8D08D',
          DEFAULT: '#FDF6F0',
          dark: '#3C5B3D',
        },
        pen: {
          DEFAULT: '#594347',
        },
        pink: {
          DEFAULT: '#F2C9D4',
        },
        tea: {
          DEFAULT: '#A6BF80',
        },
        violet: {
          DEFAULT: '#9B59B6',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    themes: [
      {
        matcha: {
          primary: '#3C5B3D',
          'primary-content': '#FDF6F0',
          secondary: '#A6BF80',
          'secondary-content': '#3C5B3D',
          accent: '#9B59B6',
          'accent-content': '#FDF6F0',
          neutral: '#594347',
          'neutral-content': '#FDF6F0',
          'base-100': '#FDF6F0',
          'base-200': '#F5EBE0',
          'base-300': '#E3D5CA',
          'base-content': '#594347',
          info: '#A8D08D',
          success: '#A6BF80',
          warning: '#F2C9D4',
          error: '#DC2626',
        },
      },
    ],
    styled: true,
    base: false,
    utils: true,
    logs: false,
  },
}
