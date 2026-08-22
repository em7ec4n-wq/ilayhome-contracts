import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#f9eddb",
          200: "#f2d8b5",
          300: "#e9be86",
          400: "#df9f55",
          500: "#d68633",
          600: "#c87028",
          700: "#a65723",
          800: "#854622",
          900: "#6c3b1f",
          950: "#3a1d0f",
        },
      },
    },
  },
  plugins: [],
};
export default config;
