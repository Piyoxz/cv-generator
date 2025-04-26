/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5757',
          dark: '#E03F3F',
          light: '#FFCECE',
        },
        secondary: {
          DEFAULT: '#3A86FF',
          dark: '#2C6AD1',
          light: '#D6E4FF',
        },
        accent: {
          DEFAULT: '#FCBF49',
          light: 'rgba(252, 191, 73, 0.2)',
        },
        success: {
          DEFAULT: '#4CBB17',
        },
        error: {
          DEFAULT: '#FF5252',
          dark: '#D14545',
        },
        neutral: {
          50: '#F5F5F5',
          100: '#EBEBEB',
          200: '#D6D6D6',
          300: '#C2C2C2',
          400: '#ADADAD',
          500: '#999999',
          600: '#757575',
          700: '#616161',
          800: '#484848',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      borderWidth: {
        '3': '3px',
        '6': '6px',
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(0, 0, 0, 1)',
        'neo-sm': '3px 3px 0px 0px rgba(0, 0, 0, 1)',
        'neo-lg': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-3px)' },
          '75%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};