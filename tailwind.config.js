/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        'console-dark': '#0a0a0a',
        'console-gray': '#1a1a1a',
        'console-card': '#242424',
        'console-accent': '#ff2d55', // Nintendo-ish Red
        'console-cyan': '#00e5ff',   // Tech Cyan
        'console-blue': '#007aff',
        'console-yellow': '#ffcc00',
        'console-green': '#4cd964',
      },
      borderRadius: {
        'console': '1.5rem',
        'console-inner': '1rem',
      },
      boxShadow: {
        'console': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'console-glow': '0 0 15px rgba(255, 45, 85, 0.3)',
        'console-cyan-glow': '0 0 15px rgba(0, 229, 255, 0.3)',
      },
      animation: {
        'focus-pulse': 'focus-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
      },
      keyframes: {
        'focus-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 20px 2px rgba(255, 255, 255, 0.1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
