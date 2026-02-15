/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#F59E0B',
        secondary: '#10B981',
        background: '#FFFBF5',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Noto Sans SC',
          'Source Han Sans SC',
          'sans-serif',
        ],
      },
      spacing: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
};
