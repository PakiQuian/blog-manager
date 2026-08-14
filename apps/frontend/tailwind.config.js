import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [heroui()],
};
