/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0a0a0f',
        'bg-card': '#12121a',
        'accent-cyan': '#00ffd5',
        'accent-purple': '#a855f7',
        'accent-blue': '#3b82f6',
        'accent-coral': '#ff6b6b',
        'text-primary': '#f0f0f5',
        'text-secondary': '#8888a0',
      },
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 40px rgba(0,255,213,0.3)',
        'glow-purple': '0 0 40px rgba(168,85,247,0.3)',
      },
    },
  },
  plugins: [],
}
