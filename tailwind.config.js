/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        sans: ['"Noto Sans KR"', 'sans-serif'],
      },
      colors: {
        'bg-base': '#1e1a2e',
        'bg-card': '#2a2640',
        'bg-card-hover': '#332f50',
        'accent-primary': '#7fdbca',
        'accent-secondary': '#f5c542',
        'accent-danger': '#ff6b6b',
        'text-primary': '#f0ece8',
        'text-muted': '#8a8499',
        border: '#3d3858',
      },
      boxShadow: {
        pixel: '3px 3px 0px #000',
        'pixel-sm': '2px 2px 0px #000',
        'pixel-accent': '3px 3px 0px #5ab8a4',
      },
      borderRadius: {
        card: '12px',
      },
      maxWidth: {
        mobile: '390px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease forwards',
        'slide-out': 'slideOut 0.3s ease forwards',
        'xp-fill': 'xpFill 0.6s ease forwards',
        'level-flash': 'levelFlash 0.5s ease forwards',
        'pixel-hit': 'pixelHit 0.2s steps(2) forwards',
        'bounce-pixel': 'bouncePixel 0.3s steps(3) infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideOut: {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(100%)' },
        },
        xpFill: {
          from: { width: 'var(--xp-from)' },
          to: { width: 'var(--xp-to)' },
        },
        levelFlash: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pixelHit: {
          '0%': { transform: 'translate(0,0)' },
          '25%': { transform: 'translate(-3px,-3px)' },
          '50%': { transform: 'translate(3px,3px)' },
          '75%': { transform: 'translate(-2px,2px)' },
          '100%': { transform: 'translate(0,0)' },
        },
        bouncePixel: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}
