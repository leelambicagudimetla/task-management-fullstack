/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1C1B1F',
        canvas: '#FAFAF8',
        accent: {
          DEFAULT: '#2E5A4D',
          light: '#3F7C69',
          dark: '#1E3D33',
        },
        line: '#E4E1DA',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,31,0.06), 0 1px 12px rgba(28,27,31,0.04)',
      },
    },
  },
  plugins: [],
}
