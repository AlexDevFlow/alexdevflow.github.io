/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': 'rgb(239, 224, 197)',
        'secondary-bg': 'rgb(241, 236, 226)',
        'button-bg': '#3498db',
        'button-hover': '#2980b9',
        'accent': '#09a7e0',
        'primary': '#333333',
        'text': '#555555',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
