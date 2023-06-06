import type { Config } from 'tailwindcss'

export default {
  content: [
      './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        equestria: ['Equestria', 'serif'],
        celestia: ['Celestia Redux Alternate', 'serif'],
      }
    },
  },
  plugins: [],
} satisfies Config

