import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens from stitch/DESIGN.md
        primary: '#ffc174',
        'primary-container': '#f59e0b',
        'primary-fixed': '#ffddb8',
        'primary-fixed-dim': '#ffb95f',
        'on-primary': '#472a00',
        'on-primary-container': '#613b00',
        'on-primary-fixed': '#2a1700',
        'inverse-primary': '#855300',

        secondary: '#aeb9d0',
        'secondary-container': '#3e495d',
        'secondary-fixed': '#d8e3fb',
        'on-secondary': '#263143',
        'on-secondary-container': '#aeb9d0',
        'on-secondary-fixed': '#111c2d',
        'on-secondary-fixed-variant': '#3c475a',

        tertiary: '#8fd5ff',
        'tertiary-container': '#1abdff',
        'tertiary-fixed': '#c5e7ff',
        'on-tertiary': '#00344a',
        'on-tertiary-container': '#004966',
        'on-tertiary-fixed': '#001e2d',
        'on-tertiary-fixed-variant': '#004c6a',

        background: '#0b1326',
        'on-background': '#dae2fd',

        surface: '#0b1326',
        'surface-dim': '#0b1326',
        'surface-bright': '#31394d',
        'surface-tint': '#ffb95f',
        'surface-variant': '#2d3449',
        'surface-container-lowest': '#060e20',
        'surface-container-low': '#131b2e',
        'surface-container': '#171f33',
        'surface-container-high': '#222a3d',
        'surface-container-highest': '#2d3449',
        'on-surface': '#dae2fd',
        'on-surface-variant': '#d8c3ad',
        'inverse-surface': '#dae2fd',
        'inverse-on-surface': '#283044',

        outline: '#8f9098',
        'outline-variant': '#44474f',

        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        headline: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        amber: '0 8px 20px -4px rgba(255, 193, 116, 0.4)',
        'amber-lg': '0 12px 24px -4px rgba(255, 193, 116, 0.6)',
        glow: '0 0 8px rgba(143, 213, 255, 0.6)',
        deep: '0 32px 64px -8px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}

export default config
