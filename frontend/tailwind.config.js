/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stellar: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        ink: {
          800: '#111a2e',
          900: '#0b1120',
          950: '#060a14',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        display: ['3.5rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -8px rgba(16,24,40,0.12)',
        'card-hover': '0 2px 4px rgba(16,24,40,0.06), 0 16px 40px -8px rgba(16,24,40,0.18)',
        glow: '0 0 40px -8px rgba(59,130,246,0.5)',
        'glow-lg': '0 0 90px -16px rgba(59,130,246,0.55)',
        'inner-light': 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(-1.5%)' },
          '50%': { transform: 'translateY(1.5%)' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up-delay-1': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        'fade-up-delay-2': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'fade-up-delay-3': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
        float: 'float 7s ease-in-out infinite',
        'ping-slow': 'ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
