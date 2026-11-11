/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0F172A",
          card: "#1E293B",
          accent: "#38BDF8",
          purple: "#A855F7",
          green: "#22C55E",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'snake-move': 'snake-dash 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', boxShadow: '0 0 15px rgba(56, 189, 248, 0.6)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)', boxShadow: '0 0 25px rgba(56, 189, 248, 0.9)' },
        },
        'snake-dash': {
          'to': { strokeDashoffset: '-100' },
        }
      }
    },
  },
  plugins: [],
}
