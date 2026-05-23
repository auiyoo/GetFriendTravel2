/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07070F',
          800: '#0D0D1A',
          700: '#12121F',
          600: '#1A1A2E',
          500: '#22223B',
          400: '#2D2D44',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        pink: {
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        neon: {
          purple: '#BF5AF2',
          pink: '#FF375F',
          blue: '#0A84FF',
          green: '#32D74B',
          yellow: '#FFD60A',
          orange: '#FF9F0A',
        }
      },
      fontFamily: {
        thai: ['Sarabun', 'sans-serif'],
        display: ['Sarabun', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(236,72,153,0.15) 100%)',
        'glow-violet': 'radial-gradient(circle at center, rgba(139,92,246,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(139,92,246,0.4)',
        'glow': '0 0 30px rgba(139,92,246,0.5)',
        'glow-pink': '0 0 30px rgba(236,72,153,0.5)',
        'glow-cyan': '0 0 30px rgba(6,182,212,0.5)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139,92,246,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(139,92,246,0.8)' },
        }
      }
    }
  },
  plugins: []
}
