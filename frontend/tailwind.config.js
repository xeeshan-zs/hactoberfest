/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#050508',
          bgLight: '#F4F4F0',
          surface: '#0E0E14',
          surfaceLight: '#FFFFFF',
          card: '#14141E',
          cardLight: '#FFFFFF',
          border: '#38384A',
          borderLight: '#000000',
          white: '#FFFFFF',
          yellow: '#FFE600',
          green: '#00F5A0',
          pink: '#FF2E63',
          cyan: '#00F0FF',
          purple: '#B066FF',
          orange: '#FF8A00',
        }
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px 0px #000000',
        'brutal': '5px 5px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-yellow': '5px 5px 0px 0px #FFE600',
        'brutal-green': '5px 5px 0px 0px #00F5A0',
        'brutal-pink': '5px 5px 0px 0px #FF2E63',
        'brutal-cyan': '5px 5px 0px 0px #00F0FF',
        'brutal-white': '5px 5px 0px 0px #FFFFFF',
        'brutal-white-sm': '3px 3px 0px 0px #FFFFFF',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
