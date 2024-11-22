/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        "up-down-1": "up-down 0.5s ease-in-out infinite alternate",
        "up-down-2": "up-down 0.5s ease-in-out infinite alternate 0.16s",
        "up-down-3": "up-down 0.5s ease-in-out infinite alternate 0.32s",
        "up-down-4": "up-down 0.5s ease-in-out infinite alternate 0.48s",
      },
      keyframes: {
        "up-down": {
          "0%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(10px)" },
        },
      },
    },
  },
  plugins: [],
}
